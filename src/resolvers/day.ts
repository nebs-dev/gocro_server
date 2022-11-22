import { Day, dayRelations } from "@entities/Day";
import { Route } from "@entities/Route";
import { paginate } from "@services/paginatorService";
import { DayArgs } from "@shared/arguments";
import { forbiddenErr } from "@shared/constants";
import { DayPaginatorResponse } from "@shared/responses";
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

@InputType()
class DayCreateInput {
  @Field()
  title: string;
  @Field()
  text: string;
  @Field(() => Int)
  route_id: number;
}

@InputType()
class DayUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  text: string;
  @Field(() => Int, { nullable: true })
  route_id: number;
}

@Resolver()
export class DayResolver {
  @Query(() => DayPaginatorResponse)
  async days(
    @Args() { filters, pagination }: DayArgs
  ): Promise<PaginatorResponseType> {
    return paginate(Day, dayRelations, filters, pagination);
  }

  @Query(() => Day)
  async day(@Arg("id") id: number): Promise<Day> {
    return Day.findOneOrFail(id, { relations: dayRelations });
  }

  @Mutation(() => Day)
  async createDay(
    @Arg("params") params: DayCreateInput,
    @Ctx() context: MyContext
  ): Promise<Day> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let day = new Day();
    const route = await Route.findOneOrFail(params.route_id);

    params = { ...params, ...{ route } };
    day = Object.assign(day, params);

    const errors = await validate(day, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid day input", { errors });
    }

    try {
      await day.save();

      return day;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Day)
  async updateDay(
    @Arg("id") id: number,
    @Arg("params") params: DayUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Day> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let day = await Day.findOneOrFail(id, { relations: dayRelations });
    day = Object.assign(day, params);

    const errors = await validate(day, {
      groups: ["update"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid day input", { errors });
    }

    try {
      await day.save();

      return day;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteDay(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    const day = await Day.findOneOrFail(id);

    try {
      await day.remove();

      return true;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }
}
