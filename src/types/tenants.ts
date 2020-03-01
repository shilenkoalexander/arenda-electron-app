import { $enum } from 'ts-enum-util';

export interface TenantInfo {
    fullName: string;
    legalAddress: string;
    inn: string;
    tenantType: TenantType;
}

export enum TenantType {
    LTD, SE, PE, UNKNOWN,
}

export function getTenantValue(type: TenantType): string {
    return $enum.mapValue(type).with({
        [TenantType.LTD]: 'ООО',
        [TenantType.SE]: 'ГП',
        [TenantType.PE]: 'ЧП',
        [TenantType.UNKNOWN]: 'Неизвестно',
    });
}

export interface Subtenant {
    name: string;
    square: string;
    startDate: Date;
    endDate: Date;
    businessType: string;
}
