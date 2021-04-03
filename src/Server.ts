import morgan from "morgan";
import helmet from "helmet";
import express from "express";

import "express-async-errors";

import logger from "@shared/Logger";
import { databaseData } from "@shared/constants";

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
import { CategoryResolver } from "@resolvers/category";
import { ClientResolver } from "@resolvers/client";
import { GuidedInfoResolver } from "@resolvers/guidedInfo";
import { PriceResolver } from "@resolvers/price";
import { EventResolver } from "@resolvers/event";
import { ReviewResolver } from "@resolvers/review";
import { DayResolver } from "@resolvers/day";
import fake from "./utils/faker";
import { TehnicalInfoResolver } from "@resolvers/tehnicalInfo";

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
const app = express();

createConnection({
  type: "mysql",
  host: databaseData.DB_HOST,
  port: databaseData.DB_PORT,
  username: databaseData.DB_USER,
  password: databaseData.DB_PASSWORD,
  database: databaseData.DB_NAME,
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
          CategoryResolver,
          ClientResolver,
          GuidedInfoResolver,
          PriceResolver,
          EventResolver,
          TehnicalInfoResolver,
          ReviewResolver,
          DayResolver,
        ],
        validate: false,
      }),
      context: async ({ req, res }) => {
        const loggedIn: Boolean = await isAuthenticated(req);
        const tokenData: IClientData | null = await getTokenData(req);
        const isAdmin: Boolean = tokenData ? tokenData.user.role === 1 : false;

        return {
          req,
          res,
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

    const corsOptions = {
      origin: "http://localhost:3000",
      credentials: true,
    };

    apolloServer.applyMiddleware({ app, cors: corsOptions });

    // enable files upload
    app.use(
      fileUpload({
        createParentPath: true,
      })
    );

    app.use(pagination);

    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    // Security
    if (process.env.NODE_ENV === "production") {
      app.use(helmet());
    }

    var argv = require("minimist")(process.argv.slice(2));
    if (argv.fake && argv.fake === "true") {
      fake();
    }
  })
  .catch((error) => console.log(error));

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
