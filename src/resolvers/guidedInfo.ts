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

    const guidedInfo = new GuidedInfo();
    const {
      age_min,
      age_max,
      starts_from,
      people_min,
      people_max,
      accommodation,
      meals,
      transfer,
      equipment,
      insurance,
      availability_from,
      availability_to,
      discount,
      cancelation_policy,
      not_include,
      additional_charge,
      route_id,
    } = params;

    const route = await Route.findOneOrFail({ id: route_id });

    guidedInfo.age_min = age_min;
    guidedInfo.age_max = age_max;
    guidedInfo.starts_from = starts_from;
    guidedInfo.people_min = people_min;
    guidedInfo.people_max = people_max;
    guidedInfo.accommodation = accommodation;
    guidedInfo.meals = meals;
    guidedInfo.transfer = transfer;
    guidedInfo.equipment = equipment;
    guidedInfo.insurance = insurance;
    guidedInfo.availability_from = availability_from;
    guidedInfo.availability_to = availability_to;
    guidedInfo.discount = discount;
    guidedInfo.cancelation_policy = cancelation_policy;
    guidedInfo.not_include = not_include;
    guidedInfo.additional_charge = additional_charge;
    guidedInfo.route = route;

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
