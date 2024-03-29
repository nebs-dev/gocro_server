import { Location, locationRelations } from "@entities/Location";
import { paginate } from "@services/paginatorService";
import { LocationArgs } from "@shared/arguments";
import { forbiddenErr } from "@shared/constants";
import { LocationPaginatorResponse } from "@shared/responses";
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
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
class LocationCreateInput {
  @Field()
  title: string;
  @Field()
  description: string;
}

@InputType()
class LocationUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  description: string;
}

@Resolver()
export class LocationResolver {
  @Query(() => LocationPaginatorResponse)
  async locations(
    @Args() { filters, pagination }: LocationArgs
  ): Promise<PaginatorResponseType> {
    return await paginate(Location, locationRelations, filters, pagination);
  }

  @Query(() => Location)
  async location(@Arg("id") id: number): Promise<Location> {
    return await Location.findOneOrFail(id);
  }

  @Mutation(() => Location)
  async createLocation(
    @Arg("params") params: LocationCreateInput,
    @Ctx() context: MyContext
  ): Promise<Location> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let location = new Location();
    location = Object.assign(location, params);

    const errors = await validate(location, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid location input", { errors });
    }

    try {
      await location.save();

      return location;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Location)
  async updateLocation(
    @Arg("id") id: number,
    @Arg("params") params: LocationUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Location> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let location = await Location.findOneOrFail(id);
    location = Object.assign(location, params);

    const errors = await validate(location, {
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid location input", { errors });
    }

    try {
      await location.save();

      return location;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteLocation(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    const location = await Location.findOneOrFail({ id });

    try {
      await location.remove();
      return true;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }
}
