import { Category, categoryRelations } from "@entities/Category";
import { MyContext, PaginatorResponseType } from "@shared/types";
import { forbiddenErr } from "@shared/constants";
import { CategoryPaginatorResponse } from "@shared/responses";
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
import { paginate } from "@services/paginatorService";
import { CategoryArgs } from "@shared/arguments";

@InputType()
class CategoryCreateInput {
  @Field()
  title: string;
}

@InputType()
class CategoryUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;
}

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryPaginatorResponse)
  async categories(
    @Args() { filters, pagination }: CategoryArgs
  ): Promise<PaginatorResponseType> {
    return await paginate(Category, categoryRelations, filters, pagination);
  }

  @Query(() => Category)
  async category(@Arg("id") id: number): Promise<Category> {
    return await Category.findOneOrFail(id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("params") params: CategoryCreateInput,
    @Ctx() context: MyContext
  ): Promise<Category> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let category = new Category();
    category = Object.assign(category, params);

    const errors = await validate(category, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid category input", { errors });
    }

    try {
      await category.save();

      return category;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id") id: number,
    @Arg("params") params: CategoryUpdateInput,
    @Ctx() context: MyContext
  ): Promise<Category> {
    if (!context.isAdmin) {
      throw new ForbiddenError(forbiddenErr);
    }

    let category = await Category.findOneOrFail(id);
    category = Object.assign(category, params);

    const errors = await validate(category, {
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid category input", { errors });
    }

    try {
      await category.save();

      return category;
    } catch (e: any) {
      throw new ApolloError(e);
    }
  }
}
