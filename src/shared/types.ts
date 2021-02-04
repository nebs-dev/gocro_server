import { IClientData } from "@services/JwtService";
import { Request } from "express";
import Logger from "jet-logger";

export type MyContext = {
  req: Request;
  loggedIn: Boolean;
  isAdmin: Boolean;
  tokenData: IClientData | null;
  logger: Logger;
};
