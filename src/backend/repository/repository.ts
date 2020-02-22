import { Page, Pagination } from '@/types/common';
import db from 'better-sqlite3-helper';
import { toLimit, toOrderBy } from '@/backend/utils/sql-util';
import { ResultMapper } from '@/backend/mapper/result-mapper';
import { OrderMapper } from '@/backend/mapper/order-mapper';

export function queryWithPagination<T>(
    query: string,
    pagination: Pagination,
    resultMapper: ResultMapper<T>,
    orderMapper: OrderMapper,
): Page<T> {
    const count = db().queryFirstRow(`
        select count(*) as totalItems
        from (${query}) as q;
    `) as any;

    const items = db().query(`
        ${query}
        ${toOrderBy(pagination, orderMapper)}
        ${toLimit(pagination.page, pagination.size)}
    `);

    return {
        totalItems: count.totalItems,
        totalPages: Math.ceil(count.totalItems / pagination.size),
        content: items.map(resultMapper.map),
    };
}
