import { Page, Pagination } from '@/types/common';
import db from 'better-sqlite3-helper';
import { toLimit, toOrderBy } from '@/backend/utils/sql-util';
import { OrderMapper } from '@/backend/mapper/order-mapper';
import { ResultMapper } from '@/backend/mapper/result-mapper';
import BetterSqlite3Helper from 'better-sqlite3-helper';
import DataObject = BetterSqlite3Helper.DataObject;
import Optional from '@/backend/utils/optional';


export function findFirst(query: string): Optional<DataObject> {
    return Optional.of(db().queryFirstRow(query));
}

export function queryWithPagination<T>(
    query: string,
    pagination: Pagination,
    resultMapper: ResultMapper<T>,
    orderMapper: OrderMapper,
): Page<T> {
    const count = findFirst(`
        select count(*) as totalItems
        from (${query}) as q;
    `).orElseThrowWithMessage(`База дала йобу и вернула undefined на count(*) запрос`);

    const items = db().query(`
        ${query}
        ${toOrderBy(pagination, orderMapper)}
        ${toLimit(pagination.page, pagination.size)}
    `);

    return {
        totalItems: count.totalItems,
        totalPages: Math.ceil(count.totalItems / pagination.size),
        content: items.map((value) => resultMapper.map(value)),
    };
}

export function executeInTransaction(action: () => void) {
    db().transaction(action)();
}
