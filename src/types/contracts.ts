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
    startDate: Date;
    validity: Date | null;
    tenantInfo: TenantInfo;
    status: ContractStatus;
}

export interface ShortContractDetails {
    id: number;
    number: string;
    startDate: Date;
    validity: Date | null;
    endDate: Date | null;
    endReason: string | null;
    status: ContractStatus;
    type: string;
    lastContractExtensionFrom: Date | null;
    lastContractExtensionTo: Date | null;
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
