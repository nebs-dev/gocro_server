import bcrypt from "bcrypt";
import { Response, Router } from "express";
import StatusCodes from "http-status-codes";

import { JwtService } from "@services/JwtService";
import { paramMissingError, loginFailedErr, IRequest } from "@shared/constants";
import { User } from "@entities/User";
import { getRepository } from "typeorm";

const router = Router();
// const userDao = new UserDao();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post("/login", async (req: IRequest, res: Response) => {
  // Check email and password present
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Fetch user
  const user = await getRepository(User).findOne({ email: email });

  if (!user) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Check password
  const pwdPassed = await bcrypt.compare(password, user.password);

  if (!pwdPassed) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Setup Admin Cookie
  const jwt = await jwtService.getJwt({
    id: user.id,
    role: user.role,
  });

  // Return
  return res.status(OK).json({
    token: jwt,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
