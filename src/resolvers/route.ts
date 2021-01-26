import { Location } from "@entities/Location";
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
class RouteCreateInput {
  @Field(() => String)
  title: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  details: string;
  @Field(() => Int, { nullable: true })
  fitness_level: bigint;
  @Field(() => Int, { nullable: true })
  experience: bigint;
  @Field({ nullable: true })
  note: string;
  @Field(() => Int)
  location_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
}

@InputType()
class RouteUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => String, { nullable: true })
  details: string;
  @Field(() => Int, { nullable: true })
  fitness_level: bigint;
  @Field(() => Int, { nullable: true })
  experience: bigint;
  @Field(() => String, { nullable: true })
  note: string;
  @Field(() => Int, { nullable: true })
  location_id: number;
  @Field(() => Int, { nullable: true })
  category_id: number;
}

@Resolver()
export class RouteResolver {
  @Query(() => [Route])
  async routes(): Promise<Route[]> {
    return await Route.find({
      relations: [
        "location",
        "categories",
        "client",
        "days",
        "days.tehnical_info",
        "tehnical_info",
        "guided_info",
      ],
    });
  }

  @Query(() => Route)
  async route(@Arg("id") id: number): Promise<Route> {
    return await Route.findOneOrFail(id, {
      relations: ["location", "categories"],
    });
  }

  @Mutation(() => Route)
  async createRoute(
    @Arg("params") params: RouteCreateInput,
    @Ctx() context: MyContext
  ): Promise<Route> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let route = new Route();
    const { location_id } = params;

    const location = await Location.findOneOrFail({ id: location_id });
    params = { ...params, ...{ location } };
    route = Object.assign(route, params);

    const errors = await validate(route, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid route input", { errors });
    }

    try {
      await route.save();

      return route;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Route)
  async updateRoute(
    @Arg("id") id: number,
    @Arg("params") params: RouteUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Route> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let route = await Route.findOneOrFail(id);
    const { location_id } = params;

    if (location_id) {
      const location = await Location.findOneOrFail({ id: location_id });
      params = { ...params, ...{ location } };
    }

    route = Object.assign(route, params);

    const errors = await validate(route, {
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid route input", { errors });
    }

    try {
      await route.save();

      return route;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteRoute(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let route = await Route.findOneOrFail({ id });

    try {
      await route.remove();
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
