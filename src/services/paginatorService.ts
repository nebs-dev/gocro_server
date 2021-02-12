import {
  IFilter,
  PaginationInput,
  PaginationClientInput,
} from "@shared/inputs";
import { PaginatorData } from "@shared/responses";
import { PaginatorResponseType } from "@shared/types";
import { BaseEntity, EntityTarget, getRepository } from "typeorm";

const number = 1;
const size = 10;

export const paginate = async (
  type: EntityTarget<BaseEntity>,
  relations: Array<string>,
  filters: IFilter,
  pagination: PaginationClientInput
): Promise<PaginatorResponseType> => {
  const paginationData = getPaginationData(pagination);

  const repo = getRepository(type);
  const [data, count] = await repo.findAndCount({
    relations: relations,
    where: filters,
    take: pagination ? paginationData.take : undefined,
    skip: pagination ? paginationData.skip : undefined,
  });

  return {
    data,
    pagination: getPaginationMeta(pagination, count),
  };
};

export const getPaginationData = (
  pagination: PaginationClientInput
): PaginationInput => {
  const pageSize = pagination ? pagination.size : size;
  const pageNumber = pagination ? pagination.number : number;

  const take = pageSize;
  const skip = (pageNumber - 1) * pageSize;

  return { skip, take };
};

export const getPaginationMeta = (
  pagination: PaginationClientInput,
  count: number
): PaginatorData => {
  const pageSize = pagination ? pagination.size : size;
  const pageNumber = pagination ? pagination.number : number;

  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber >= totalPages ? null : pageNumber + 1;
  const previousPage =
    pageNumber === 1 || pageNumber >= totalPages ? null : pageNumber - 1;

  return {
    total: count,
    currentPage: pageNumber,
    nextPage,
    previousPage: previousPage,
    perPage: pageSize,
    totalPages,
  };
};
