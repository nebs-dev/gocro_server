import { Client } from "@entities/Client";
import { forbiddenErr } from "@shared/constants";
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
class ClientCreateInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  address: string;
}

@InputType()
class ClientUpdateInput {
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String, { nullable: true })
  email: string;
  @Field(() => String, { nullable: true })
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
    @Arg("params") params: ClientCreateInput,
    @Ctx() context: MyContext
  ): Promise<Client> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let client = new Client();
    client = Object.assign(client, params);

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

  @Mutation(() => Client)
  async updateClient(
    @Arg("id") id: number,
    @Arg("params") params: ClientUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Client> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let client = await Client.findOneOrFail(id);
    client = Object.assign(client, params);

    const errors = await validate(client, {
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

  @Mutation(() => Boolean)
  async deleteClient(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let client = await Client.findOneOrFail({ id });

    try {
      await client.remove();
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
