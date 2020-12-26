"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const typeorm_pagination_1 = require("typeorm-pagination");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const user_1 = require("./resolvers/user");
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
const app = express_1.default();
typeorm_1.createConnection({
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
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const { BAD_REQUEST } = http_status_codes_1.default;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver],
            validate: false,
        }),
        context: (req, res) => ({ req, res }),
    });
    // app.use(isAuthenticatedMiddleware);
    apolloServer.applyMiddleware({ app });
    // app.use(cors());
    // enable files upload
    app.use(express_fileupload_1.default({
        createParentPath: true,
    }));
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: true }));
    // app.use(cookieParser(cookieProps.secret));
    app.use(typeorm_pagination_1.pagination);
    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
        app.use(morgan_1.default("dev"));
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
}))
    .catch((error) => console.log(error));
/************************************************************************************
 *                              Export Server
 ***********************************************************************************/
exports.default = app;
