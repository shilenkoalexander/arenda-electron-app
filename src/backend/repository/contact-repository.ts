import { Contact } from '@/types/contracts';
import db from 'better-sqlite3-helper';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';

export function getContactsByTenantId(tenantId: number): Contact[] {
    const contacts = db().query(`
        select contact, ct.name as type
        from contacts
            inner join contact_type ct on id_type = ct.id
        where id_tenant = ${tenantId}
    `);
    return contacts.map((value) => ResultMapperFactory.contactMapper.map(value));
}
