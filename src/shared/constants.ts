import { Request } from "express";
import { IUser } from "@entities/User";

// Strings
export const paramMissingError =
  "One or more of the required parameters was missing.";
export const loginFailedErr = "Login failed";
export const internalServerErr = "Internal Server Error";

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
