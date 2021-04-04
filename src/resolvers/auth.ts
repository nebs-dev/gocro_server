import { User } from "@entities/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import bcrypt from "bcrypt";
import randomString from "randomstring";
import { JwtService } from "@services/JwtService";
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from "apollo-server-express";
import { MyContext } from "@shared/types";
import { validate } from "class-validator";
import { internalServerErr } from "@shared/constants";
import { UserToken } from "@entities/UserToken";
import dayjs from "dayjs";

@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class AuthReponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  token?: string;
  @Field(() => String, { nullable: true })
  refreshToken?: string;
}

const jwtService = new JwtService();

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthReponse)
  async login(
    @Arg("params") params: EmailPasswordInput,
    @Ctx() context: MyContext
  ): Promise<AuthReponse> {
    const user = await User.findOne({
      email: params.email,
      active: true,
      is_deleted: false,
    });

    if (!user) {
      throw new AuthenticationError("User doesn't exist");
    }

    const valid = await bcrypt.compare(params.password, user.password);
    if (!valid) {
      throw new AuthenticationError("Incorrect pasword");
    }

    const accessToken = await jwtService.getJwt({
      id: user.id,
      user,
    });

    try {
      const userToken = this.createUserToken(user, 7);
      await userToken.save();

      this.setRefreshTokenCookie(context, userToken.refresh_token, 7);

      return {
        user,
        token: accessToken,
        refreshToken: userToken.refresh_token,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => AuthReponse)
  async refreshToken(
    @Arg("refreshToken", { nullable: true }) refreshToken: string,
    @Ctx() context: MyContext
  ): Promise<AuthReponse> {
    if (!refreshToken) {
      if (!context.req.cookies.refresh_token)
        throw new AuthenticationError("refreshToken not provided");

      refreshToken = context.req.cookies.refresh_token;
    }

    const userToken = await UserToken.findOne(
      {
        refresh_token: refreshToken,
      },
      { relations: ["user"] }
    );

    if (!userToken) {
      throw new AuthenticationError("Wrong refresh token provided");
    }

    if (!userToken.user) {
      throw new AuthenticationError("User doesn't exist");
    }

    if (userToken.expires_at <= dayjs().toDate()) {
      await userToken.remove();
      throw new AuthenticationError("Refresh token expired");
    }

    const accessToken = await jwtService.getJwt({
      id: userToken.user.id,
      user: userToken.user,
    });

    try {
      const newUserToken = this.createUserToken(userToken.user, 7);

      await newUserToken.save();
      await userToken.remove();

      this.setRefreshTokenCookie(context, userToken.refresh_token, 7);

      return {
        user: newUserToken.user,
        token: accessToken,
        refreshToken: newUserToken.refresh_token,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => AuthReponse)
  async register(
    @Arg("params") params: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<AuthReponse> {
    const user = new User();
    const { username, email, password } = params;

    user.username = username;
    user.email = email;
    user.password = password;

    const errors = await validate(user, {
      groups: ["create"],
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid user input", { errors });
    }

    try {
      const userToken = this.createUserToken(user, 7);

      await user.save();
      await userToken.save();

      this.setRefreshTokenCookie(context, userToken.refresh_token, 7);

      const accessToken = await jwtService.getJwt({
        id: user.id,
        user,
      });

      return {
        user,
        token: accessToken,
        refreshToken: userToken.refresh_token,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  private createUserToken(user: User, daysValid: number) {
    const userToken = new UserToken();
    userToken.refresh_token = randomString.generate(200);
    userToken.user = user;
    userToken.expires_at = dayjs().add(daysValid, "day").toDate();
    return userToken;
  }

  private setRefreshTokenCookie(
    ctx: MyContext,
    refreshToken: string,
    daysValid: number
  ) {
    ctx.res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: daysValid * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });
  }
}
