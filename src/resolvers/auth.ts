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
import { JwtService } from "@services/JwtService";
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from "apollo-server-express";
import { MyContext } from "@shared/types";
import { validate } from "class-validator";
import { internalServerErr } from "@shared/constants";

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
  token?: String;
}

const jwtService = new JwtService();

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthReponse)
  async login(@Arg("params") params: EmailPasswordInput): Promise<AuthReponse> {
    const user = await User.findOne({ email: params.email, active: true });

    if (!user) {
      throw new AuthenticationError("email doesn't exist");
    }

    const valid = await bcrypt.compare(params.password, user.password);
    if (!valid) {
      throw new AuthenticationError("Incorrect pasword");
    }

    const accessToken = await jwtService.getJwt({
      id: user.id,
      user,
    });

    return { user, token: accessToken };
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
