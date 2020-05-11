import { $enum } from 'ts-enum-util';
import { TenantInfo } from '@/types/tenants';
import { ShortObjectDetails } from '@/types/objects';

export enum ContractStatus {
    ACTIVE,
    EXTENDED,
    PAUSED,
    CLOSED,
    UNKNOWN,
}

export function getContractStatusValue(status: ContractStatus): string {
    return $enum.mapValue(status).with({
        [ContractStatus.ACTIVE]: 'Действующий',
        [ContractStatus.EXTENDED]: 'Продлен',
        [ContractStatus.PAUSED]: 'Приостановлен',
        [ContractStatus.CLOSED]: 'Закрыт',
        [ContractStatus.UNKNOWN]: 'Неизвестный',
    });
}

export interface Contract {
    id: number;
    number: string;
    startDate: string;
    validity: string | null;
    totalPayment: number;
    conclusionDate: Date;
    status: ContractStatus;
}

export interface ContractWithTenant {
    id: number;
    number: string;
    startDate: string;
    validity: string | null;
    tenantInfo: TenantInfo;
    status: ContractStatus;
}

export interface ShortContractDetails {
    id: number;
    number: string;
    startDate: string;
    validity: string | null;
    endDate: string | null;
    endReason: string | null;
    status: ContractStatus;
    type: string;
    lastContractExtensionFrom: string | null;
    lastContractExtensionTo: string | null;
}

export interface FullContractDetails {
    contractInfo: ShortContractDetails;
    tenantInfo: TenantInfo;
    contacts: Contact[];
    objectsInfo: ShortObjectDetails[];
}

export interface Contact {
    contact: string;
    type: ContactType;
}

export enum ContactType {
    PHONE, EMAIL, SOCIAL, UNKNOWN,
}

export enum ContractFilterMode {
    ADDRESS, CONTRACT_NUMBER, TENANT,
}

export function getContactTypeValue(type: ContactType): string {
    return $enum.mapValue(type).with({
        [ContactType.EMAIL]: 'Электронная почта',
        [ContactType.PHONE]: 'Телефон',
        [ContactType.SOCIAL]: 'Соц. сеть или мессенджер',
        [ContactType.UNKNOWN]: 'Неизвестный тип',
    });
}

export interface AddContractMainInfoDto {
    tenantId: number | null;
    contractNumber: string;
    startDate: string;
    validity: string;
    contractTypeId: number | null;
    indexing: boolean;
}

export interface ContractPageMainInfo {
    tenantId: number;
    tenantName: string;
    contractType: string;
    contractNumber: string;
    calculationStartDate: Date;
    validity: Date;
}

export interface FullContractExtension {
    id: number;
    startDate: Date;
    endDate: Date;
    conclusionDate: Date;
    payment: number;
    paymentActualityDate: Date;
}

export interface EditableContractExtension extends FullContractExtension {
    isNew: boolean;
    isDeleted: boolean;
}
