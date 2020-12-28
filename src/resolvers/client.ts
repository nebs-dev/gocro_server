import { Client } from "@entities/Client";
import { MyContext } from "@shared/types";
import {
  ApolloError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { validate } from "class-validator";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
class ClientInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  address: string;
}

@Resolver()
export class ClientResolver {
  @Query(() => [Client])
  async clients(): Promise<Client[]> {
    return await Client.find({ relations: ["routes", "routes.location"] });
  }

  @Query(() => Client)
  async client(@Arg("id") id: number): Promise<Client> {
    return await Client.findOneOrFail(id);
  }

  @Mutation(() => Client)
  async createClient(
    @Arg("params") params: ClientInput,
    @Ctx() context: MyContext
  ): Promise<Client> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    const client = new Client();
    const { name, email, address } = params;

    client.name = name;
    client.email = email;
    client.address = address;

    const errors = await validate(client, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid client input", { errors });
    }

    try {
      await client.save();

      return client;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
