import { EntityRepository, Repository } from "typeorm";
import { TehnicalInfo, tehnicalInfoRelations } from "@entities/TehnicalInfo";
import { PaginationClientInput, TehnicalInfoFilterInput } from "@shared/inputs";
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

@EntityRepository(TehnicalInfo)
export class TehnicalInfoRepository extends Repository<TehnicalInfo> {
  async search(
    filters: TehnicalInfoFilterInput,
    pagination: PaginationClientInput
  ): Promise<PaginatorResponseType> {
    const qb = this.createQueryBuilder("tehnicalInfo");

    const paginationData = getPaginationData(pagination);

    const { route_id, day_id } = filters;
    delete filters.route_id;
    delete filters.day_id;

    addRelations(qb, tehnicalInfoRelations);
    addFilters(qb, filters, tehnicalInfoRelations);
    addPagination(qb, paginationData);

    if (route_id) {
      qb.andWhere("route.id = :route_id", { route_id });
    }

    if (day_id) {
      qb.andWhere("day.id = :day_id", { day_id });
    }

    const [data, count] = await qb.getManyAndCount();
    return {
      data,
      pagination: getPaginationMeta(pagination, count),
    };
  }
}
