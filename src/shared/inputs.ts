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
export class RouteFilterInput implements IFilter {
  @Field(() => Int, { nullable: true })
  location: number;
  @Field(() => [Int], { nullable: true })
  categories: Array<number>;
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => Boolean, { nullable: true })
  featured: Boolean;
}

@InputType()
export class LocationFilterInput implements IFilter {
  @Field(() => String, { nullable: true })
  title: string;
}

@InputType()
export class CategoryFilterInput implements IFilter {
  @Field(() => String, { nullable: true })
  title: string;
}

@InputType()
export class ClientFilterInput implements IFilter {
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String, { nullable: true })
  email: string;
}

@InputType()
export class EventFilterInput implements IFilter {
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  text: string;
  @Field(() => Int, { nullable: true })
  location: number;
  @Field(() => Int, { nullable: true })
  category: number;
}

@InputType()
export class TehnicalInfoFilterInput implements IFilter {
  @Field(() => Int, { nullable: true })
  elevation_min: number;
  @Field(() => Int, { nullable: true })
  elevation_max: number;
  @Field(() => Int, { nullable: true })
  length: number;
  @Field(() => Int, { nullable: true })
  duration: number;
}
