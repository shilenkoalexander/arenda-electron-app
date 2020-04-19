import {
    Contact,
    ContactType,
    ContractPageMainInfo,
    ContractStatus,
    ContractWithTenant,
    FullContractDetails,
} from '@/types/contracts';
import { $enum } from 'ts-enum-util';
import { TenantType } from '@/types/tenants';
import { ShortObjectDetails } from '@/types/objects';
import { FinancePeriod, InflationIndex } from '@/types/finance';
import { BetterSqlite3Helper } from 'better-sqlite3-helper';
import DataObject = BetterSqlite3Helper.DataObject;

export abstract class ResultMapper<T> {
    public map(value: DataObject | undefined): T {
        if (value === undefined) {
            throw new Error('Value is undefined');
        }
        return this.innerMap(value);
    }

    public get() {
        return this;
    }

    protected abstract innerMap(value: DataObject): T;
}

export class ContractMapper extends ResultMapper<ContractWithTenant> {
    protected innerMap(value: DataObject): ContractWithTenant {
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

class FullContractDetailsMapper extends ResultMapper<FullContractDetails> {
    protected innerMap(value: DataObject): FullContractDetails {
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

class ContactMapper extends ResultMapper<Contact> {
    protected innerMap(value: DataObject): Contact {
        return {
            contact: value.contact,
            type: $enum(ContactType).getValueOrDefault(value.type, ContactType.UNKNOWN),
        };
    }
}

class ShortObjectDetailsMapper extends ResultMapper<ShortObjectDetails> {
    protected innerMap(value: DataObject): ShortObjectDetails {
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

class ContractPageMainInfoMapper extends ResultMapper<ContractPageMainInfo> {
    protected innerMap(value: DataObject): ContractPageMainInfo {
        return {
            tenantId: value.tenant_id,
            tenantName: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
            contractNumber: value.contract_number,
            contractType: value.contract_type,
        };
    }
}

class FinancialPeriodMapper extends ResultMapper<FinancePeriod> {
    protected innerMap(value: DataObject): FinancePeriod {
        return {
            period: value.period,
            accruals: Number.parseFloat(value.accruals),
            adjustments: Number.parseFloat(value.adjustments),
            payments: Number.parseFloat(value.payments),
            debt: Number.parseFloat(value.debt),
        };
    }
}

class InflationIndexMapper extends ResultMapper<InflationIndex> {
    protected innerMap(value: DataObject): InflationIndex {
        return {
            period: value.period,
            date: value.date,
            index: Number.parseFloat(value.index),
        };
    }
}

export class ResultMapperFactory {
    static readonly contactMapper: ResultMapper<Contact> = new ContactMapper();
    static readonly fullContractDetailsMapper: ResultMapper<FullContractDetails> = new FullContractDetailsMapper();
    static readonly contractMapper: ResultMapper<ContractWithTenant> = new ContractMapper();
    static readonly objectShortDetailsMapper: ResultMapper<ShortObjectDetails> = new ShortObjectDetailsMapper();
    static readonly contractPageMainInfoMapper: ResultMapper<ContractPageMainInfo> = new ContractPageMainInfoMapper();
    static readonly financePeriodMapper: ResultMapper<FinancePeriod> = new FinancialPeriodMapper();
    static readonly inflationIndexMapper: ResultMapper<InflationIndex> = new InflationIndexMapper();
}
