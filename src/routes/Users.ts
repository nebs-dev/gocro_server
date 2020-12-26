import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";

import { paramMissingError, IRequest } from "@shared/constants";
import { getRepository } from "typeorm";
import { User } from "@entities/User";
import { adminMW } from "./middleware";
import { validate } from "class-validator";

const router = Router();
const {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

/******************************************************************************
 *                      Get All Users - "GET /api/users"
 ******************************************************************************/

// router.get('/', adminMW, async (req: Request, res: Response) => {
router.get("/", adminMW, async (req: Request, res: Response) => {
  const data = await getRepository(User).createQueryBuilder("user").paginate();
  return res.status(OK).json(data);
});

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getRepository(User).findOne(id);

  if (!user) {
    return res.status(NOT_FOUND).json({
      error: "Not Found",
    });
  }

  return res.status(OK).json(user);
});

/******************************************************************************
 *                       Add One - "POST /api/users"
 ******************************************************************************/

router.post("/", adminMW, async (req: Request, res: Response) => {
  const user = new User();
  const { username, email, password } = req.body;

  user.username = username;
  user.email = email;
  user.password = password;

  const errors = await validate(user, {
    groups: ["create"],
  });

  if (errors.length > 0) {
    return res.status(BAD_REQUEST).json(errors);
  } else {
    const response = await getRepository(User).save(user);
    return res.status(CREATED).json(response);
  }
});

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

router.put("/:id", adminMW, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getRepository(User).findOne(id);

  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const { username, email, password } = req.body;

  user.username = username;
  user.email = email;
  user.password = password !== "" ? password : undefined;

  const errors = await validate(user, {
    groups: ["update"],
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    return res.status(BAD_REQUEST).json(errors);
  } else {
    await getRepository(User).save(user);
    const response = await getRepository(User).findOneOrFail(user.id);
    return res.status(OK).json(response);
  }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete("/:id", adminMW, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const user = await getRepository(User).findOne(id);

  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  try {
    await getRepository(User).delete(id);
    return res.status(OK).end();
  } catch (e) {
    return res.status(INTERNAL_SERVER_ERROR).json(e);
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
