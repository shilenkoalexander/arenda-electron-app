import { Contact } from '@/model/types/contract-types';
import { ResultMapperFactory } from '@/model/mapper/result-mapper-factory';
import { selectArray } from '@/model/repository/repository';

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
