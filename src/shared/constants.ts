import { Request } from "express";
import { IUser } from "@entities/User";

// Strings
export const paramMissingError =
  "One or more of the required parameters was missing.";
export const loginFailedErr = "Login failed";
export const internalServerErr = "Internal Server Error";
export const forbiddenErr = "You are not allowed to access.";

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: "ExpressGeneratorTs",
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: process.env.COOKIE_PATH,
    maxAge: Number(process.env.COOKIE_EXP),
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.SECURE_COOKIE === "true",
  },
});

// IRequest object for express routes
export interface IRequest extends Request {
  body: {
    user: IUser;
    email: string;
    password: string | undefined;
  };
}

// Amazon S3
export const S3_ID = process.env.S3_ID;
export const S3_SECRET = process.env.S3_SECRET;
export const S3_BUCKET_NAME = String(process.env.S3_BUCKET_NAME);

export const DB_NAME = String(process.env.DB_NAME);
export const DB_USER = String(process.env.DB_USER);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_PORT = String(process.env.DB_PORT);
export const DB_HOST = String(process.env.DB_HOST);
export const DB_TYPE = String(process.env.DB_TYPE);

export const databaseData = {
  DB_NAME: String(process.env.DB_NAME),
  DB_USER: String(process.env.DB_USER),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  DB_PORT: Number(process.env.DB_PORT),
  DB_HOST: String(process.env.DB_HOST),
};
