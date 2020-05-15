import { Contact } from '@/backend/types/contract-types';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';
import { selectArray } from '@/backend/repository/repository';

export function getContactsByTenantId(tenantId: number): Contact[] {
    return selectArray(`
            select contact, ct.name as type
            from contacts
                inner join contact_type ct on id_type = ct.id
            where id_tenant = ${tenantId}
        `,
        ResultMapperFactory.contactMapper,
    );
}
