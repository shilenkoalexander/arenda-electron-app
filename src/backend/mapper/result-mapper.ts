import { Contact, ContactType, Contract, ContractStatus, FullContractDetails } from '@/types/contracts';
import { $enum } from 'ts-enum-util';
import { TenantType } from '@/types/tenants';
import { ShortObjectDetails } from '@/types/objects';

export interface ResultMapper<T> {
    map(value: any): T;
}

class ContractMapper implements ResultMapper<Contract> {
    map(value: any): Contract {
        return {
            id: value.id,
            number: value.contract_number,
            startDate: value.start_date,
            validity: value.validity,
            tenantInfo: {
                tenantType: $enum(TenantType).getValueOrDefault(value.tenant_type, TenantType.UNKNOWN),
                legalAddress: value.legal_address,
                inn: value.inn,
                fullName: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
            },
            status: $enum(ContractStatus).getValueOrDefault(value.status, ContractStatus.UNKNOWN),
        };
    }
}

class FullContractDetailsMapper implements ResultMapper<FullContractDetails> {
    map(value: any): FullContractDetails {
        return {
            contractInfo: {
                id: value.id,
                type: value.contract_type,
                number: value.contract_number,
                validity: value.validity,
                startDate: value.start_date,
                endDate: value.end_date,
                endReason: value.end_reason,
                status: $enum(ContractStatus).getValueOrDefault(value.status, ContractStatus.UNKNOWN),
                lastContractExtensionFrom: value.last_contract_extention_to,
                lastContractExtensionTo: value.last_contract_extention_from,
            },
            tenantInfo: {
                tenantType: $enum(TenantType).getValueOrDefault(value.tenant_type, TenantType.UNKNOWN),
                legalAddress: value.legal_address,
                inn: value.inn,
                fullName: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
            },
            contacts: value.contacts,
            objectsInfo: value.objectsInfo,
        };
    }

}

class ContactMapper implements ResultMapper<Contact> {
    map(value: any): Contact {
        return {
            contact: value.contact,
            type: $enum(ContactType).getValueOrDefault(value.type, ContactType.UNKNOWN),
        };
    }
}

class ShortObjectDetailsMapper implements ResultMapper<ShortObjectDetails> {
    map(value: any): ShortObjectDetails {
        return {
            id: value.id,
            payment: value.payment,
            businessType: value.business_type,
            subtenantsCount: value.subtenants_count,
            rentalRate: value.rental_rate,
            startDate: value.start_date,
            onBalance: value.on_balance,
            address: value.address,
            endDate: value.end_date,
            objectIndividualInformation: value.objectIndividualInformation,
        };
    }
}

export class ResultMapperFactory {
    static readonly contactMapper: ResultMapper<Contact> = new ContactMapper();
    static readonly fullContractDetailsMapper: ResultMapper<FullContractDetails> = new FullContractDetailsMapper();
    static readonly contractMapper: ResultMapper<Contract> = new ContractMapper();
    static readonly objectShortDetailsMapper: ResultMapper<ShortObjectDetails> = new ShortObjectDetailsMapper();
}
