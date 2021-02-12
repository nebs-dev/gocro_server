import { ArgsType, Field, InputType, Int } from "type-graphql";
import { BaseEntity } from "typeorm";

export interface IFilter {}

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip: number;
  @Field(() => Int)
  take: number;
}

@InputType()
export class PaginationClientInput {
  @Field(() => Int)
  number: number;
  @Field(() => Int)
  size: number;
}

@InputType()
export class PaginatorDataInput {
  @Field(() => [BaseEntity])
  data: BaseEntity[];
  @Field(() => Int)
  count: number;
}

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
class LocationFilterInput implements IFilter {
  @Field(() => String, { nullable: true })
  title: string;
}

@ArgsType()
export class RouteListArgs {
  @Field(() => RouteFilterInput, { nullable: true })
  filters: RouteFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}

@ArgsType()
export class LocationArgs {
  @Field(() => LocationFilterInput, { nullable: true })
  filters: LocationFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}
