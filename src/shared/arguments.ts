import { ArgsType, Field } from "type-graphql";
import {
  CategoryFilterInput,
  ClientFilterInput,
  EventFilterInput,
  LocationFilterInput,
  PaginationClientInput,
  RouteFilterInput,
  TehnicalInfoFilterInput,
} from "./inputs";

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

@ArgsType()
export class CategoryArgs {
  @Field(() => CategoryFilterInput, { nullable: true })
  filters: CategoryFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}

@ArgsType()
export class ClientArgs {
  @Field(() => ClientFilterInput, { nullable: true })
  filters: ClientFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}

@ArgsType()
export class EventArgs {
  @Field(() => EventFilterInput, { nullable: true })
  filters: EventFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}

@ArgsType()
export class TehnicalInfoArgs {
  @Field(() => EventFilterInput, { nullable: true })
  filters: TehnicalInfoFilterInput;
  @Field(() => PaginationClientInput, { nullable: true })
  pagination: PaginationClientInput;
}
