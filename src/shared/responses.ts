import { Location } from "@entities/Location";
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
