export function toOrderBy(sortBy: string | null): string {
    return sortBy && sortBy.length > 0 ? `ORDER BY ${sortBy}` : '';
}

export function toLimit(page: number, size: number): string {
    return `LIMIT ${(page - 1) * size}, ${size}`;
}

export function getContractOrderByString(sortBy: string): string | null {
    if (!sortBy) {
        return null;
    }

    if (sortBy === 'contract') {
        return 'number';
    }

    if (sortBy === 'tenant') {
        return `
        ORDER BY CASE t.organization_name
            WHEN NULL THEN t.responsible_person
            ELSE t.organization_name
        END DESC
        `;
    }

    return null;
}
