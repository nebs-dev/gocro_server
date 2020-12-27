import { User } from "@entities/User";
import { MyContext } from "@shared/types";
import { Ctx, Query, Resolver } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() context: MyContext): Promise<User[]> {
    if (!context.loggedIn) {
      throw new AuthenticationError("Unauthenticated!");
    }

    return User.find();
  }
}
