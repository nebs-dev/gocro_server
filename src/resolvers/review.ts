import { Review, reviewRelations } from "@entities/Review";
import { Route } from "@entities/Route";
import { User } from "@entities/User";
import { paginate } from "@services/paginatorService";
import { ReviewArgs } from "@shared/arguments";
import { forbiddenErr } from "@shared/constants";
import { ReviewPaginatorResponse } from "@shared/responses";
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
class ReviewCreateInput {
  @Field()
  title: string;
  @Field(() => String, { nullable: true })
  text: string;
  @Field(() => Int)
  rate: number;
  @Field(() => Int)
  route_id: number;  
}

@InputType()
class ReviewUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  text: string;
  @Field(() => Int, { nullable: true })
  rate: number;
}

@Resolver()
export class ReviewResolver {
  @Query(() => ReviewPaginatorResponse)
  async reviews(
    @Args() { filters, pagination }: ReviewArgs
  ): Promise<PaginatorResponseType> {
    return await paginate(Review, reviewRelations, filters, pagination);
  }

  @Query(() => Review)
  async review(@Arg("id") id: number): Promise<Review> {
    return await Review.findOneOrFail(id);
  }

  @Mutation(() => Review)
  async createReview(
    @Arg("params") params: ReviewCreateInput,
    @Ctx() context: MyContext
  ): Promise<Review> {
    if (!context.loggedIn) {
      throw new ForbiddenError(forbiddenErr);
    }

    const { route_id } = params;
    
    const user = await User.findOne(context.tokenData?.user.id);
    if (!user) {
      throw new UserInputError("User doesn't exist");
    }
    
    const route = await Route.findOne({ id: route_id });
    if (!route) {
      throw new UserInputError("Provided route_id doesn't exist");
    }

    params = { ...params, ...{ route }, ...{user} };
    
    let review = new Review();
    review = Object.assign(review, params);    

    const errors = await validate(review, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid review input", { errors });
    }

    try {
      await review.save();

      return review;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Review)
  async updateReview(
    @Arg("id") id: number,
    @Arg("params") params: ReviewUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Review> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let review = await Review.findOneOrFail(id);
    review = Object.assign(review, params);

    const errors = await validate(review, {
      forbidUnknownValues: true,
      skipMissingProperties: true
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid review input", { errors });
    }

    try {
      await review.save();

      return review;
    } catch(e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Boolean)
  async deleteReview(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let review = await Review.findOneOrFail(id);

    try {
      await review.remove();
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}