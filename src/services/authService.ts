import { Request } from "express";
import { JwtService } from "@services/JwtService";
import { IClientData } from "@services/JwtService";

const jwtService = new JwtService();

export const isAuthenticated = async (req: Request): Promise<boolean> => {
  try {
    // Get json-web-token
    const jwt = jwtService.extractToken(req);

    if (!jwt) {
      return false;
    }

    await jwtService.verifyJwt(jwt);

    return true;
  } catch (err) {
    return false;
  }
};

export const getTokenData = async (
  req: Request
): Promise<IClientData | null> => {
  try {
    // Get json-web-token
    const jwt = jwtService.extractToken(req);

    if (!jwt) {
      return null;
    }

    return await jwtService.decodeJwt(jwt);
  } catch (err) {
    return null;
  }
};
