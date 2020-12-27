import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import express from "express";

import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@shared/Logger";

import "reflect-metadata";
import { createConnection } from "typeorm";
import fileUpload from "express-fileupload";
import cors from "cors";
import { pagination } from "typeorm-pagination";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "@resolvers/user";
import { AuthResolver } from "@resolvers/auth";
import { RouteResolver } from "@resolvers/route";
import { getTokenData, isAuthenticated } from "@services/authService";
import { IClientData } from "@services/JwtService";
import { LocationResolver } from "@resolvers/location";

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
const app = express();

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "gocro_db",
  entities: [__dirname + "/entities/*.ts"],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          UserResolver,
          AuthResolver,
          RouteResolver,
          LocationResolver,
        ],
        validate: false,
      }),
      context: async ({ req }) => {
        const loggedIn: Boolean = await isAuthenticated(req);
        const tokenData: IClientData | null = await getTokenData(req);
        const isAdmin: Boolean = tokenData ? tokenData.user.role === 1 : false;

        return {
          req,
          loggedIn,
          isAdmin,
          tokenData,
          logger,
        };
      },
      formatError: (err) => {
        if (err.message.startsWith("Database Error: ")) {
          return new Error("Internal server error");
        }

        return err;
      },
      debug: true,
    });

    apolloServer.applyMiddleware({ app });

    // app.use(cors());

    // enable files upload
    app.use(
      fileUpload({
        createParentPath: true,
      })
    );

    // app.use(express.json());
    // app.use(express.urlencoded({ extended: true }));
    // app.use(cookieParser(cookieProps.secret));
    app.use(pagination);

    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    // Security
    // if (process.env.NODE_ENV === "production") {
    //   app.use(helmet());
    // }

    // Add APIs
    // app.use("/api", BaseRouter);

    // Print API errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // app.use((err: Error, req: Request, res: Response) => {
    //   logger.err(err, true);
    //   return res.json({
    //     error: err.message,
    //   });
    // });
  })
  .catch((error) => console.log(error));

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
