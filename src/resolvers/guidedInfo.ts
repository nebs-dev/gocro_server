import { GuidedInfo } from "@entities/GuidedInfo";
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
  Resolver,
} from "type-graphql";

@InputType()
class GuidedInfoInput {
  @Field(() => Int, { nullable: true })
  age_min: bigint;
  @Field(() => Int, { nullable: true })
  age_max: bigint;
  @Field(() => String, { nullable: true })
  starts_from: string;
  @Field(() => Int, { nullable: true })
  people_min: bigint;
  @Field(() => Int, { nullable: true })
  people_max: bigint;
  @Field(() => String, { nullable: true })
  accommodation: string;
  @Field(() => String, { nullable: true })
  meals: string;
  @Field(() => String, { nullable: true })
  transfer: string;
  @Field(() => String, { nullable: true })
  equipment: string;
  @Field(() => String, { nullable: true })
  insurance: string;
  @Field(() => String, { nullable: true })
  availability_from: string;
  @Field(() => String, { nullable: true })
  availability_to: string;
  @Field(() => String, { nullable: true })
  discount: string;
  @Field(() => String, { nullable: true })
  cancelation_policy: string;
  @Field(() => String, { nullable: true })
  not_include: string;
  @Field(() => String, { nullable: true })
  additional_charge: string;
  @Field(() => Int)
  route_id: bigint;
}

@Resolver()
export class GuidedInfoResolver {
  @Mutation(() => GuidedInfo)
  async createGuidedInfo(
    @Arg("params") params: GuidedInfoInput,
    @Ctx() context: MyContext
  ): Promise<GuidedInfo> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let guidedInfo = new GuidedInfo();
    const { route_id } = params;

    const route = await Route.findOneOrFail({ id: route_id });
    params = { ...params, ...{ route } };
    guidedInfo = Object.assign(guidedInfo, params);

    const errors = await validate(guidedInfo, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid route input", { errors });
    }

    try {
      await guidedInfo.save();

      return guidedInfo;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
