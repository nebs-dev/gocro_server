import { EntityRepository, Repository } from "typeorm";
import { Event, eventRelations } from "@entities/Event";
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

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async search(
    filters: IFilter,
    pagination: PaginationClientInput
  ): Promise<PaginatorResponseType> {
    const qb = this.createQueryBuilder("event");

    const paginationData = getPaginationData(pagination);

    addRelations(qb, eventRelations);
    addFilters(qb, filters, eventRelations);
    addPagination(qb, paginationData);

    const [data, count] = await qb.getManyAndCount();

    return {
      data,
      pagination: getPaginationMeta(pagination, count),
    };
  }
}
