import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  QueryParams,
  QueryRequest,
  QueryValue,
} from '../../domain/common/query';

const getFirstQueryValue = (value: QueryValue, fallback: string): string => {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
};

export const Query = createParamDecorator<undefined, QueryParams>(
  (_data: undefined, ctx: ExecutionContext): QueryParams => {
    const req = ctx.switchToHttp().getRequest<{ query: QueryRequest }>();

    const { page, limit, search, sortBy, sortOrder, ...filters } = req.query;

    const pageValue = getFirstQueryValue(page, '1');
    const limitValue = getFirstQueryValue(limit, '10');
    const searchValue = getFirstQueryValue(search, '').trim();
    const sortByValue = getFirstQueryValue(sortBy, '').trim();
    const sortOrderValue = getFirstQueryValue(sortOrder, 'asc')
      .toLowerCase()
      .trim();

    const pageNumber = parseInt(pageValue, 10);
    const limitNumber = parseInt(limitValue, 10);
    const normalizedSortOrder = sortOrderValue === 'desc' ? 'desc' : 'asc';

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new BadRequestException('Page must be >= 1');
    }

    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const normalizedFilters = Object.entries(filters).reduce(
      (accumulator, [key, value]) => {
        const filterValue = getFirstQueryValue(value, '').trim();

        if (filterValue) {
          accumulator[key] = filterValue;
        }

        return accumulator;
      },
      {} as Record<string, string>,
    );

    return {
      page: pageNumber,
      limit: limitNumber,
      skip: (pageNumber - 1) * limitNumber,
      ...(searchValue && { search: searchValue }),
      ...(sortByValue && { sortBy: sortByValue }),
      ...(sortByValue && { sortOrder: normalizedSortOrder }),
      ...(Object.keys(normalizedFilters).length > 0 && {
        filters: normalizedFilters,
      }),
    };
  },
);
