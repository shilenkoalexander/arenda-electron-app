import { ContractStatus } from '@/backend/types/contract-types';

export interface ContractsFilter {
    status: ContractStatus | null;
    filterMode: ContractFilterMode | null;
    search: string | null;
}

export enum ContractFilterMode {
    ADDRESS, CONTRACT_NUMBER, TENANT,
}

export interface TenantsFilter {
    filterMode: TenantsFilterMode | null;
    search: string | null;
}

export enum TenantsFilterMode {
    NAME, ADDRESS,
}

export function contractFilterToWhereClause(filter: ContractsFilter | null): string {
    if (!filter) {
        return '';
    }

    let addressSearchClause = '';
    const clauses = [];

    if (filter.search) {
        if (filter.filterMode === ContractFilterMode.ADDRESS) {
            addressSearchClause = `inner join (
                                    select *
                                    from objects
                                    where address like '%${filter.search}%'
                                ) s on s.id_contract = c.id`;
        }

        if (filter.filterMode === ContractFilterMode.CONTRACT_NUMBER) {
            clauses.push(`contract_number like '%${filter.search}%'`);
        }

        if (filter.filterMode === ContractFilterMode.TENANT) {
            clauses.push(`(
                t.organization_name like '%${filter.search}%'
                OR t.responsible_person like '%${filter.search}%')`,
            );
        }
    }

    if (filter.status != null) {
        clauses.push(`status = '${ContractStatus[filter.status]}'`);
    }

    let clausesQuery = '';
    if (clauses.length > 0) {
        clausesQuery = clauses.join(' AND ');
    }
    return `${addressSearchClause} ${clausesQuery ? 'WHERE' : ''} ${clausesQuery}`;
}

export function tenantFilterToWhereClause(filter: TenantsFilter | null) {
    if (!filter) {
        return '';
    }
}
