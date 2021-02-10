import { IFilter, PaginationInput } from "@shared/inputs";
import { BaseEntity, SelectQueryBuilder } from "typeorm";

export const addPagination = (
  qb: SelectQueryBuilder<BaseEntity>,
  pagination: PaginationInput
): SelectQueryBuilder<BaseEntity> => {
  if (pagination.take) {
    qb.take(pagination.take);
  }

  if (pagination.skip) {
    qb.skip(pagination.skip);
  }

  return qb;
};

export const addRelations = (
  qb: SelectQueryBuilder<BaseEntity>,
  relations: Array<string>
): SelectQueryBuilder<BaseEntity> => {
  Object.entries(relations).forEach(([key, value]) => {
    const aliases = value.split(".");

    if (aliases.length > 1) {
      qb.leftJoinAndSelect(
        `${aliases[0]}.${aliases[1]}`,
        `${aliases[0]}.${aliases[1]}`
      );
    } else {
      qb.leftJoinAndSelect(`${qb.alias}.${value}`, value);
    }
  });

  return qb;
};

export const addFilters = (
  qb: SelectQueryBuilder<BaseEntity>,
  filters: IFilter,
  relations: Array<string>
): SelectQueryBuilder<BaseEntity> => {
  Object.entries(filters).forEach(([key, value]) => {
    const name = relations.includes(key) ? `${key}.id` : `${qb.alias}.${key}`;

    if (Array.isArray(value)) {
      qb.where(name + " IN (:ids)", { ids: value });
    } else {
      const isString = typeof value === "string";
      const firstChar = isString ? value.charAt(0) : null;
      const lastChar = isString ? value.charAt(value.length - 1) : null;

      if (firstChar === "%" || lastChar === "%") {
        qb.where(name + " LIKE :value", { value: value });
      } else {
        qb.where(name + " = :value", { value });
      }
    }
  });

  return qb;
};
