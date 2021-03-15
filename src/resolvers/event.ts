import { Category } from "@entities/Category";
import { Event, eventRelations } from "@entities/Event";
import { Location } from "@entities/Location";
import { EventRepository } from "@entities/repositories/EventRepository";
import { paginate } from "@services/paginatorService";
import { EventArgs } from "@shared/arguments";
import { forbiddenErr } from "@shared/constants";
import { EventPaginatorResponse } from "@shared/responses";
import { MyContext, PaginatorResponseType } from "@shared/types";
import {
  ApolloError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { NumberAttributeValue } from "aws-sdk/clients/dynamodbstreams";
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
import { getCustomRepository } from "typeorm";

@InputType()
class EventCreateInput {
  @Field()
  title: string;
  @Field()
  text: string;
  @Field(() => Int)
  category_id: number;
  @Field(() => Int)
  location_id: number;
}

@InputType()
class EventUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  text: string;
  @Field(() => Int, { nullable: true })
  category_id: number;
  @Field(() => Int, { nullable: true })
  location_id: number;
}

@Resolver()
export class EventResolver {
  @Query(() => EventPaginatorResponse)
  async events(
    @Args() { filters, pagination }: EventArgs
  ): Promise<PaginatorResponseType> {
    const routeRepository = getCustomRepository(EventRepository);
    return await routeRepository.search(filters, pagination);
  }

  @Query(() => Event)
  async event(@Arg("id") id: number): Promise<Event> {
    return await Event.findOneOrFail(id);
  }

  @Mutation(() => Event)
  async createEvent(
    @Arg("params") params: EventCreateInput,
    @Ctx() context: MyContext
  ): Promise<Event> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let event = new Event();

    const { category_id, location_id } = params;
    const category = await Category.findOneOrFail({ id: category_id });
    const location = await Location.findOneOrFail({ id: location_id });

    params = { ...params, ...{ category, location } };
    event = Object.assign(event, params);

    const errors = await validate(event, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid location input", { errors });
    }

    try {
      await event.save();

      return event;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg("id") id: number,
    @Arg("params") params: EventUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Event> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let event = await Event.findOneOrFail(id, {
      relations: ["category", "location"],
    });

    const { category_id, location_id } = params;
    if (category_id) {
      const category = await Category.findOneOrFail({ id: category_id });
      params = { ...params, ...{ category } };
    }

    if (location_id) {
      const location = await Location.findOneOrFail({ id: location_id });
      params = { ...params, ...{ location } };
    }

    event = Object.assign(event, params);

    const errors = await validate(event, {
      groups: ["update"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid location input", { errors });
    }

    try {
      await event.save();

      return event;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteEvent(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let event = await Event.findOneOrFail({ id });

    try {
      await event.remove();
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
