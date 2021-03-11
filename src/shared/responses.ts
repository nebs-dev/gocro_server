import { Category } from "@entities/Category";
import { Client } from "@entities/Client";
import { Event } from "@entities/Event";
import { Location } from "@entities/Location";
import { Review } from "@entities/Review";
import { Route } from "@entities/Route";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatorData {
  @Field(() => Int)
  total: number;
  @Field(() => Int)
  currentPage: number;
  @Field(() => Int, { nullable: true })
  nextPage: number | null;
  @Field(() => Int, { nullable: true })
  previousPage: number | null;
  @Field(() => Int)
  perPage: number;
  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class LocationPaginatorResponse {
  @Field(() => [Location])
  data: Location[];
  @Field(() => PaginatorData)
  pagination: PaginatorData;
}

@ObjectType()
export class RoutePaginatorResponse {
  @Field(() => [Route])
  data: Route[];
  @Field(() => PaginatorData, { nullable: true })
  pagination: PaginatorData;
}

@ObjectType()
export class CategoryPaginatorResponse {
  @Field(() => [Category])
  data: Category[];
  @Field(() => PaginatorData)
  pagination: PaginatorData;
}

@ObjectType()
export class ClientPaginatorResponse {
  @Field(() => [Client])
  data: Client[];
  @Field(() => PaginatorData)
  pagination: PaginatorData;
}

@ObjectType()
export class EventPaginatorResponse {
  @Field(() => [Event])
  data: Event[];
  @Field(() => PaginatorData)
  pagination: PaginatorData;
}

@ObjectType()
export class ReviewPaginatorResponse {
  @Field(() => [Review])
  data: Review[];
  @Field(() => PaginatorData)
  pagination: PaginatorData;
}