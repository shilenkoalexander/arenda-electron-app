import { Contract } from '@/types/contracts';
import db from 'better-sqlite3-helper';
import { mapContract } from '@/backend/mapper/mapper';
import { Page, Pagination } from '@/types/common';
import { getContractOrderByString, toLimit, toOrderBy } from '@/backend/utils/sql-util';

export function getAllContracts(pagination: Pagination): Page<Contract> {
    const contracts = db().query(`
        select c.id,
               c.contract_number,
               c.start_date,
               c.validity,
               t.organization_name,
               t.responsible_person,
               t.legal_address,
               t.inn,
               tt.name as tenant_type,
               cs.name as status
        from contracts c
                 inner join tenants t on t.id = c.id_tenant
                 inner join tenant_types tt on tt.id = t.id_tenant_type
                 inner join contract_statuses cs on cs.id = c.id_status
        ${toOrderBy(getContractOrderByString(pagination.sort))}
        ${toLimit(pagination.page, pagination.size)}
    `);
    return {
        content: contracts.map(mapContract),
        totalItems: 15,
        totalPages: 3,
    };
}
