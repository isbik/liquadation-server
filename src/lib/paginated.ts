import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';

export type Options<T> = {
  offset?: number;
  limit?: number;
} & FilterQuery<T>;

export const paginated = async <T>(
  model: EntityRepository<T>,
  where?: Options<T>,
  options?: FindOptions<T, any>,
) => {
  const { offset = 0, limit = 10, ...restOptions } = options;

  const [items, total] = await model.findAndCount(where, {
    offset,
    limit,
    ...restOptions,
  });

  return { items, total };
};
