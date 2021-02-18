import { User } from "@entities/User";
import { MyContext } from "@shared/types";
import { Ctx, Query, Resolver } from "type-graphql";
import { ForbiddenError } from "apollo-server-express";
import { forbiddenErr } from "@shared/constants";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() context: MyContext): Promise<User[]> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    return User.find();
  }
}
