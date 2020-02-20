import { Contract, ContractStatus } from '@/types/contracts';
import { $enum } from 'ts-enum-util';
import { TenantType } from '@/types/tenants';
import { parseDate } from '@/utils/date-utils';

export function mapContract(value: any): Contract {
    return {
        id: value.id,
        number: value.contract_number,
        startDate: parseDate(value.start_date),
        validity: value.validity ? parseDate(value.validity) : null,
        tenantInfo: {
            tenantType: $enum(TenantType).getValueOrDefault(value.tenant_type, TenantType.UNKNOWN),
            legalAddress: value.legal_address,
            inn: value.inn,
            fullName: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
        },
        status: $enum(ContractStatus).getValueOrDefault(value.status, ContractStatus.UNKNOWN),
    };
}
