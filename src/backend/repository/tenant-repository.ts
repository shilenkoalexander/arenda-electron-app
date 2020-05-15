import db from 'better-sqlite3-helper';
import { InputItem } from '@/types/common';

export function getAllTenantsNames(): InputItem[] {
    const result = db().query(`select id, organization_name, responsible_person from tenants`);

    return result.map((value) => ({
        text: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
        value: value.id,
    }));
}
