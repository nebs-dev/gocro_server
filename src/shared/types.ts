import { IClientData } from "@services/JwtService";
import { Request, Response } from "express";
import Logger from "jet-logger";
import { BaseEntity } from "typeorm";

export type MyContext = {
  req: Request;
  res: Response;
  loggedIn: boolean;
  isAdmin: boolean;
  tokenData: IClientData | null;
  logger: Logger;
};

export type PaginatorResponseType = {
  data: BaseEntity[];
  pagination: {
    total: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    perPage: number;
    totalPages: number;
  };
};
