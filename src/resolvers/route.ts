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
class RouteInput {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field()
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
    @Arg("params") params: RouteInput,
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
}
