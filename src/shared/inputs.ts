import { ArgsType, Field, InputType, Int } from "type-graphql";

export interface IFilter {}

@InputType()
class RouteFilterInput implements IFilter {
  @Field(() => Int, { nullable: true })
  location: number;
  @Field(() => [Int], { nullable: true })
  categories: Array<number>;
  @Field(() => String, { nullable: true })
  title: string;
}

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip: number;
  @Field(() => Int)
  take: number;
}

@ArgsType()
export class RouteListArgs {
  @Field(() => RouteFilterInput, { nullable: true })
  filters: RouteFilterInput;
  @Field(() => PaginationInput, { nullable: true })
  pagination: PaginationInput;
}
