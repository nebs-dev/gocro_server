/* eslint-disable @typescript-eslint/ban-types */

import randomString from "randomstring";
import jsonwebtoken, { VerifyErrors } from "jsonwebtoken";
import { cookieProps, IRequest } from "@shared/constants";
import { User } from "@entities/User";

export interface IClientData {
  id: number;
  user: User;
}

interface IOptions {
  expiresIn: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly options: IOptions;
  private readonly VALIDATION_ERROR = "JSON-web-token validation failed.";

  constructor() {
    this.secret = process.env.JWT_SECRET || randomString.generate(100);
    this.options = { expiresIn: cookieProps.options.maxAge.toString() };
  }

  /**
   * Encrypt data and return jwt.
   *
   * @param data
   */
  public getJwt(data: IClientData): Promise<string> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
        err ? reject(err) : resolve(token);
      });
    });
  }

  /**
   * Decrypt JWT and extract client data.
   *
   * @param jwt
   */
  public decodeJwt(jwt: string): Promise<IClientData> {
    return new Promise((res, rej) => {
      jsonwebtoken.verify(
        jwt,
        this.secret,
        (err: VerifyErrors | null, decoded?: object) => {
          return err ? rej(this.VALIDATION_ERROR) : res(decoded as IClientData);
        }
      );
    });
  }

  /**
   * Decrypt JWT and extract client data.
   *
   * @param jwt
   */
  public verifyJwt(jwt: string): Promise<Boolean> {
    return new Promise((res, rej) => {
      jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors | null) => {
        return err ? rej(this.VALIDATION_ERROR) : res(true);
      });
    });
  }

  public extractToken(req: IRequest): string | null {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return String(req.query.token);
    }
    return null;
  }
}
