import { OrderMapper } from '@/backend/mapper/order-mapper';
import { Pagination } from '@/types/common';

export function toOrderBy(pagination: Pagination, mapper: OrderMapper): string {
    const sortBy = mapper.map(pagination.sort, pagination.desc);
    return sortBy && sortBy.length > 0 ? `ORDER BY ${sortBy}` : '';
}

export function toLimit(page: number, size: number): string {
    return `LIMIT ${(page - 1) * size}, ${size}`;
}
