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

    addRelations(qb, tehnicalInfoRelations);
    addFilters(qb, filters, tehnicalInfoRelations);
    addPagination(qb, paginationData);

    const [data, count] = await qb.getManyAndCount();
    return {
      data,
      pagination: getPaginationMeta(pagination, count),
    };
  }
}
