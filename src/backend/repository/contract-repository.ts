import { Contract } from '@/types/contracts';
import { ContractMapper } from '@/backend/mapper/result-mapper';
import { Page, Pagination } from '@/types/common';
import { queryWithPagination } from '@/backend/repository/repository';
import { ContractOrderMapper } from '@/backend/mapper/order-mapper';
import { contractFilterToWhereClause, ContractsFilterInfo } from '@/backend/filter/filter';

export function getAllContracts(pagination: Pagination, filter: ContractsFilterInfo | null): Page<Contract> {
    const query = `
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
        ${contractFilterToWhereClause(filter)}
        group by c.id`;
    return queryWithPagination(query, pagination, new ContractMapper(), new ContractOrderMapper());
}
