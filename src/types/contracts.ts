import { $enum } from 'ts-enum-util';
import { TenantInfo, TenantType } from '@/types/tenants';
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
    endDate: Date;
    tenantInfo: TenantInfo;
    status: ContractStatus;
}

export interface ShortContractDetails {
    id: number;
    number: string;
    startDate: Date;
    validity: Date;
    endDate: Date;
    endReason: string;
    status: ContractStatus;
    type: string;
    lastContractExtensionFrom: Date;
    lastContractExtensionTo: Date;
    organizationName: string;
    responsiblePerson: string;
    inn: string;
    legalAddress: string;
    tenantType: TenantType;
}

export interface FullContractDetails {
    contractInfo: ShortContractDetails;
    contacts: string[];
    objectsInfo: ShortObjectDetails[];
}

