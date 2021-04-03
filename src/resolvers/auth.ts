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

    const refreshToken = randomString.generate(200);
    const userToken = new UserToken();
    userToken.refresh_token = refreshToken;
    userToken.user = user;
    userToken.expires_at = dayjs().add(7, "day").toDate();
    userToken.save();

    context.res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 31,
      secure: true,
      sameSite: "none",
    });

    // Generate Refresh token

    // Save Refresh token to DB

    // return refresh token as response

    // add refresh token as a cookie

    return { user, token: accessToken, refreshToken: refreshToken };
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
      await user.save();

      const accessToken = await jwtService.getJwt({
        id: user.id,
        user,
      });

      return { user, token: accessToken };
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
