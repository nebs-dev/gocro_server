import StatusCodes from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { UserRoles } from "@entities/User";
import { JwtService } from "@services/JwtService";

const jwtService = new JwtService();
const { UNAUTHORIZED } = StatusCodes;

// Middleware to verify if user is an admin
export const adminMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get json-web-token
    const jwt = jwtService.extractToken(req);

    if (!jwt) {
      throw Error("JWT not present in the request.");
    }
    // Make sure user role is an admin
    const clientData = await jwtService.decodeJwt(jwt);

    if (clientData.role === UserRoles.Admin) {
      res.locals.userId = clientData.id;
      next();
    } else {
      throw Error("Access denied.");
    }
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
};

export const authMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get json-web-token
    const jwt = jwtService.extractToken(req);

    if (!jwt) {
      throw Error("JWT not present in the request.");
    }

    next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
};
