import db from 'better-sqlite3-helper';
import { InputItem, Page, Pagination } from '@/types/common';
import { tenantFilterToWhereClause, TenantsFilter } from '@/backend/filter/filter';
import { Tenant } from '@/backend/types/tenants-types';
import { queryWithPagination } from '@/backend/repository/repository';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';
import { TenantsOrderMapper } from '@/backend/mapper/order-mapper';

export function getAllTenantsNames(): InputItem[] {
    const result = db().query(`select id, organization_name, responsible_person from tenants`);

    return result.map((value) => ({
        text: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
        value: value.id,
    }));
}

export function getAllTenants(pagination: Pagination, filter: TenantsFilter | null): Page<Tenant> {
    const query = `
        select
            t.id,
            t.organization_name,
            t.responsible_person,
            t.legal_address,
            t.inn,
            tt.name
        from tenants t
                 inner join tenant_types tt on tt.id = t.id_tenant_type
        ${tenantFilterToWhereClause(filter)}`;
    return queryWithPagination(query, pagination, ResultMapperFactory.tenantMapper, new TenantsOrderMapper());
}
