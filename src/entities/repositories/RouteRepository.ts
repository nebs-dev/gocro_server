import { EntityRepository, Repository } from "typeorm";
import { Route, routeRelations } from "@entities/Route";
import { IFilter, PaginationInput } from "@shared/inputs";
import {
  addFilters,
  addPagination,
  addRelations,
} from "@services/queryBuilderService";

@EntityRepository(Route)
export class RouteRepository extends Repository<Route> {
  async search(
    filters: IFilter,
    pagination: PaginationInput
  ): Promise<Route[]> {
    const qb = this.createQueryBuilder("route");

    addRelations(qb, routeRelations);
    addFilters(qb, filters, routeRelations);
    addPagination(qb, pagination);

    return await qb.getMany();
  }
}
