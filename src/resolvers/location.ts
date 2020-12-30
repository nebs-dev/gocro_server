import { Location } from "@entities/Location";
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
class LocationInput {
  @Field()
  title: string;
  @Field()
  description: string;
}

@Resolver()
export class LocationResolver {
  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return await Location.find();
  }

  @Query(() => Location)
  async location(@Arg("id") id: number): Promise<Location> {
    return await Location.findOneOrFail(id);
  }

  @Mutation(() => Location)
  async createLocation(
    @Arg("params") params: LocationInput,
    @Ctx() context: MyContext
  ): Promise<Location> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
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
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
