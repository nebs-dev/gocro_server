import { TehnicalInfo, tehnicalInfoRelations } from "@entities/TehnicalInfo";
import { paginate } from "@services/paginatorService";
import { TehnicalInfoArgs } from "@shared/arguments";
import { forbiddenErr } from "@shared/constants";
import { TehnicalInfoPaginatorResponse } from "@shared/responses";
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
class TehnicalInfoInput {
  @Field(() => Int, { nullable: true })
  elevation_min: number;
  @Field(() => Int, { nullable: true })
  elevation_max: number;
  @Field(() => Int, { nullable: true })
  length: number;
  @Field(() => Int, { nullable: true })
  duration: number;
  @Field(() => Int, { nullable: true })
  route_id: number;
  @Field(() => Int, { nullable: true })
  day_id: number;
}

@Resolver()
export class TehnicalInfoResolver {
  @Query(() => TehnicalInfoPaginatorResponse)
  async tehnicalInfos(
    @Args() { filters, pagination }: TehnicalInfoArgs
  ): Promise<PaginatorResponseType> {
    return await paginate(TehnicalInfo, tehnicalInfoRelations, filters, pagination);
  }

  @Query(() => TehnicalInfo)
  async tehnicalInfo(@Arg("id") id: number): Promise<TehnicalInfo> {
    return await TehnicalInfo.findOneOrFail(id);
  }

  @Mutation(() => TehnicalInfo)
  async createTehnicalInfo(
    @Arg("params") params: TehnicalInfoInput,
    @Ctx() context: MyContext
  ): Promise<TehnicalInfo> {
    if (!context.loggedIn) {
      throw new ForbiddenError(forbiddenErr);
    }

    if ((!params.day_id && !params.route_id) || (params.day_id && params.route_id)) {
      throw new UserInputError("Invalid tehnical info input. day_id or route_id must be specified");
    }

    let tehnicalInfo = new TehnicalInfo();
    tehnicalInfo = Object.assign(tehnicalInfo, params);

    const errors = await validate(tehnicalInfo, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid tehnical info input", { errors });
    }

    try {
      await tehnicalInfo.save();

      return tehnicalInfo;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}