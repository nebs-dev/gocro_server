import { Location } from "@entities/Location";
import { Route, routeRelations } from "@entities/Route";
import { MyContext, PaginatorResponseType } from "@shared/types";
import {
  ApolloError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { validate } from "class-validator";
import {
  Arg,
  Args,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { RouteRepository } from "@entities/repositories/RouteRepository";
import { getCustomRepository } from "typeorm";
import { RoutePaginatorResponse } from "@shared/responses";
import { Category } from "@entities/Category";
import { forbiddenErr } from "@shared/constants";
import { RouteListArgs } from "@shared/arguments";

@InputType()
class RouteCreateInput {
  @Field(() => String)
  title: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  details: string;
  @Field(() => Int, { nullable: true })
  fitness_level: number;
  @Field(() => Int, { nullable: true })
  experience: number;
  @Field({ nullable: true })
  note: string;
  @Field({ nullable: true })
  featured: boolean;
  @Field(() => Int)
  location_id: number;
  @Field(() => [Int], { nullable: true })
  category_ids: Array<number>;
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
  fitness_level: number;
  @Field(() => Int, { nullable: true })
  experience: number;
  @Field(() => String, { nullable: true })
  note: string;
  @Field({ nullable: true })
  featured: boolean;
  @Field(() => Int, { nullable: true })
  location_id: number;
  @Field(() => [Int], { nullable: true })
  category_ids: Array<number>;
}

@Resolver()
export class RouteResolver {
  @Query(() => RoutePaginatorResponse)
  async routes(
    @Args() { filters, pagination }: RouteListArgs
  ): Promise<PaginatorResponseType> {
    const routeRepository = getCustomRepository(RouteRepository);
    return await routeRepository.search(filters, pagination);
  }

  @Query(() => Route)
  async route(@Arg("id") id: number): Promise<Route> {
    return await Route.findOneOrFail(id, {
      relations: routeRelations,
    });
  }

  @Mutation(() => Route)
  async createRoute(
    @Arg("params") params: RouteCreateInput,
    @Ctx() context: MyContext
  ): Promise<Route> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let route = new Route();
    const { location_id } = params;

    const location = await Location.findOneOrFail({ id: location_id });
    params = { ...params, ...{ location } };

    if (params.category_ids && params.category_ids.length > 0) {
      const categories = await Promise.all(
        params.category_ids.map(async (id) => {
          return await Category.findOneOrFail(id);
        })
      );

      params = { ...params, ...{ categories } };
    }

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
    } catch (e: any) {
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
      throw new ForbiddenError(forbiddenErr);
    }

    let route = await Route.findOneOrFail(id);
    const { location_id } = params;

    if (location_id) {
      const location = await Location.findOneOrFail({ id: location_id });
      params = { ...params, ...{ location } };
    }

    if (params.category_ids && params.category_ids.length > 0) {
      const categories = await Promise.all(
        params.category_ids.map(async (id) => {
          return await Category.findOneOrFail(id);
        })
      );

      params = { ...params, ...{ categories } };
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
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteRoute(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    const route = await Route.findOneOrFail({ id });

    try {
      await route.remove();
      return true;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }
}
