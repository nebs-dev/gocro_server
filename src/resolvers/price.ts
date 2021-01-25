import { Price } from "@entities/Price";
import { Route } from "@entities/Route";
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
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
class PriceInput {
  @Field()
  amount: number;
  @Field(() => Date, { nullable: true })
  from: Date;
  @Field(() => Date, { nullable: true })
  to: Date;
  @Field(() => Int, { nullable: true })
  people_min: bigint;
  @Field(() => Int, { nullable: true })
  people_max: bigint;
  @Field(() => Int, { nullable: true })
  route_id: bigint;
  @Field(() => Int, { nullable: true })
  event_id: bigint;
}

@InputType()
class PriceFilterInput {
  @Field(() => Int, { nullable: true })
  route_id: bigint;
  @Field(() => Int, { nullable: true })
  event_id: bigint;
}

@Resolver()
export class PriceResolver {
  @Query(() => [Price])
  async prices(@Arg("filter") filter: PriceFilterInput): Promise<Price[]> {
    if (!filter.route_id && !filter.event_id) {
      throw new UserInputError("route_id OR event_id is mandatory");
    }

    return await Price.find();
  }

  @Query(() => Price)
  async price(@Arg("id") id: number): Promise<Price> {
    return await Price.findOneOrFail(id);
  }

  @Mutation(() => Price)
  async createPrice(
    @Arg("params") params: PriceInput,
    @Ctx() context: MyContext
  ): Promise<Price> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let price = new Price();
    const { route_id, event_id } = params;

    if (!route_id && !event_id) {
      throw new UserInputError("route_id OR event_id is mandatory");
    }

    if (route_id) {
      const route = await Route.findOneOrFail({ id: route_id });
      params = { ...params, ...{ route } };
    }

    if (event_id) {
      // TODO
    }

    price = Object.assign(price, params);

    const errors = await validate(price, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid price input", { errors });
    }

    try {
      await price.save();

      return price;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
