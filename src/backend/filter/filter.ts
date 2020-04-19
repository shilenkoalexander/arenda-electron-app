import { ContractFilterMode, ContractStatus } from '@/types/contracts';

export interface ContractsFilterInfo {
    status: ContractStatus | null;
    filterMode: ContractFilterMode | null;
    search: string | null;
}

export function contractFilterToWhereClause(filter: ContractsFilterInfo | null): string {
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
