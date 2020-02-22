export interface OrderMapper {
    map(sortBy: string | null, desc: boolean): string | null;
}

export class ContractOrderMapper implements OrderMapper {
    map(sortBy: string | null, desc: boolean): string | null {
        if (!sortBy) {
            return null;
        }

        if (sortBy === 'contract') {
            return `contract_number ${desc ? 'desc' : ''}`;
        }

        if (sortBy === 'tenant') {
            return ` ORDER BY CASE t.organization_name
                        WHEN NULL THEN t.responsible_person
                        ELSE t.organization_name
                     END ${desc ? 'asc' : 'desc'} `;
        }

        return null;
    }
}
