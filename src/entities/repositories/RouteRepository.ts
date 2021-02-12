import { EntityRepository, Repository } from "typeorm";
import { Route, routeRelations } from "@entities/Route";
import { IFilter, PaginationClientInput } from "@shared/inputs";
import {
  addFilters,
  addPagination,
  addRelations,
} from "@services/queryBuilderService";
import { PaginatorResponseType } from "@shared/types";
import {
  getPaginationData,
  getPaginationMeta,
} from "@services/paginatorService";

@EntityRepository(Route)
export class RouteRepository extends Repository<Route> {
  async search(
    filters: IFilter,
    pagination: PaginationClientInput
  ): Promise<PaginatorResponseType> {
    const qb = this.createQueryBuilder("route");

    const paginationData = getPaginationData(pagination);

    addRelations(qb, routeRelations);
    addFilters(qb, filters, routeRelations);
    addPagination(qb, paginationData);

    const [data, count] = await qb.getManyAndCount();

    return {
      data,
      pagination: getPaginationMeta(pagination, count),
    };
  }
}
