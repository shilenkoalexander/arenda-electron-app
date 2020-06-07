export function isEmpty(array: any[]): boolean {
    return array.length < 1;
}

export function isNotEmpty(array: any[]): boolean {
    return array.length > 0;
}

export function getTenantName(
    organizationName: string | undefined | null,
    responsiblePerson: string | undefined | null,
): string {
    return (organizationName ? `"${organizationName}" ` : ``) + responsiblePerson;
}
