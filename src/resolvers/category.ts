import { Category } from "@entities/Category";
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
class CategoryInput {
  @Field()
  title: string;
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find({ relations: ["routes"] });
  }

  @Query(() => Category)
  async category(@Arg("id") id: number): Promise<Category> {
    return await Category.findOneOrFail(id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("params") params: CategoryInput,
    @Ctx() context: MyContext
  ): Promise<Category> {
    if (!context.isAdmin) {
      throw new ForbiddenError("You are not allowed to access this.");
    }

    let category = new Category();
    category = Object.assign(category, params);

    const errors = await validate(category, {
      groups: ["create"],
      forbidUnknownValues: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new UserInputError("Invalid location input", { errors });
    }

    try {
      await category.save();

      return category;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}