import { User } from "@entities/User";
import { MyContext } from "@shared/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { forbiddenErr } from "@shared/constants";
import { validate } from "class-validator";

@InputType()
class UserInput {
  @Field(() => String, { nullable: true })
  username: string;
  @Field(() => String, { nullable: true })
  email: string;
  @Field(() => Boolean, { nullable: true })
  active: boolean;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() context: MyContext): Promise<User[]> {
    if (!context.loggedIn) {
      throw new AuthenticationError("User is not authenticated!");
    }

    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    return User.find({ where: { is_deleted: false } });
  }

  @Query(() => User)
  async user(@Arg("id") id: number): Promise<User> {
    return await User.findOneOrFail(id, { where: { is_deleted: false } });
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id") id: number,
    @Arg("params") params: UserInput,
    @Ctx() context: MyContext
  ): Promise<User> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let user = await User.findOneOrFail(id);
    user = Object.assign(user, params);

    const errors = await validate(user, {
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid user input", { errors });
    }

    try {
      await user.save();

      return user;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    const user = await User.findOneOrFail(id);
    user.is_deleted = true;

    try {
      await user.save();
      return true;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }
}
