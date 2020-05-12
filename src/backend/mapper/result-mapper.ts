import {
    Contact,
    ContactType,
    ContractPageMainInfo,
    ContractStatus,
    ContractWithTenant,
    FullContractDetails,
    FullContractExtension,
} from '@/types/contracts';
import { $enum } from 'ts-enum-util';
import { TenantType } from '@/types/tenants';
import { ShortObjectDetails } from '@/types/objects';
import { FinancePeriod, IndexingSign, InflationIndex, Payment, PaymentContractInfo } from '@/types/finance';
import { BetterSqlite3Helper } from 'better-sqlite3-helper';
import { ContractExtension } from '@/backend/types/contract-types';
import { parseDate } from '@/utils/date-utils';
import Period from '@/backend/utils/period';
import DataObject = BetterSqlite3Helper.DataObject;

export abstract class ResultMapper<T> {
    public map(value: DataObject | undefined): T {
        if (value === undefined) {
            throw new Error('Value is undefined');
        }
        return this.innerMap(value);
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

export class FullContractDetailsMapper extends ResultMapper<FullContractDetails> {
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

export class ContactMapper extends ResultMapper<Contact> {
    protected innerMap(value: DataObject): Contact {
        return {
            contact: value.contact,
            type: $enum(ContactType).getValueOrDefault(value.type, ContactType.UNKNOWN),
        };
    }
}

export class ShortObjectDetailsMapper extends ResultMapper<ShortObjectDetails> {
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

export class ContractPageMainInfoMapper extends ResultMapper<ContractPageMainInfo> {
    protected innerMap(value: DataObject): ContractPageMainInfo {
        return {
            tenantId: value.tenant_id,
            tenantName: (value.organization_name ? `"${value.organization_name}" ` : ``) + value.responsible_person,
            contractNumber: value.contract_number,
            contractType: value.contract_type,
            calculationStartDate: parseDate(value.calculation_start_date),
            validity: parseDate(value.validity),
        };
    }
}

export class FinancePeriodMapper extends ResultMapper<FinancePeriod> {
    protected innerMap(value: DataObject): FinancePeriod {
        return {
            period: Period.ofString(value.period),
            accruals: Number.parseFloat(value.accruals),
            adjustments: Number.parseFloat(value.adjustments),
            payments: Number.parseFloat(value.payments),
            debt: Number.parseFloat(value.debt),
        };
    }
}

export class InflationIndexMapper extends ResultMapper<InflationIndex> {
    protected innerMap(value: DataObject): InflationIndex {
        return {
            period: value.period,
            date: value.date,
            index: Number.parseFloat(value.index),
        };
    }
}

export class ContractExtensionMapper extends ResultMapper<ContractExtension> {
    protected innerMap(value: DataObject): ContractExtension {
        return {
            rentPayment: Number.parseFloat(value.payment),
            dateStart: parseDate(value.start_date),
            dateEnd: parseDate(value.to_date),
            paymentActualityDate: parseDate(value.payment_actuality_date),
        };
    }
}

export class PaymentContractInfoMapper extends ResultMapper<PaymentContractInfo> {
    protected innerMap(value: DataObject): PaymentContractInfo {
        return {
            actualityDate: parseDate(value.payment_actuality_date),
            startDate: parseDate(value.start_date),
            payment: Number.parseFloat(value.total_payment),
        };
    }
}

export class PaymentMapper extends ResultMapper<Payment> {
    protected innerMap(value: DataObject): Payment {
        return {
            sum: Number.parseFloat(value.sum),
            period: Period.ofString(value.period),
            date: parseDate(value.date),
        };
    }
}

export class IndexingSignMapper extends ResultMapper<IndexingSign> {
    protected innerMap(value: DataObject): IndexingSign {
        return {
            id: Number.parseInt(value.id, 10),
            period: Period.ofString(value.period),
            indexing: value.indexing,
        };
    }
}

export class FullContractExtensionMapper extends ResultMapper<FullContractExtension> {
    protected innerMap(value: DataObject): FullContractExtension {
        return {
            id: Number.parseInt(value.id, 10),
            startDate: parseDate(value.start_date),
            endDate: parseDate(value.to_date),
            conclusionDate: parseDate(value.conclusion_date),
            payment: Number.parseFloat(value.payment),
            paymentActualityDate: parseDate(value.payment_actuality_date),
        };
    }
}
