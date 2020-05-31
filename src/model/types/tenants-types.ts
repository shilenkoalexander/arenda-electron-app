import { $enum } from 'ts-enum-util';
import { Directory } from '@/model/types/common-types';

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
    square: number;
    startDate: Date;
    endDate: Date;
    businessType: Directory;
}

export interface SubtenantWithObjectId extends Subtenant {
    objectId: number;
    id: number;
}

export interface EditSubtenantDto extends Subtenant {
    id: number | null;
}

export interface Tenant {
    id: number;
    organizationName: string;
    responsiblePerson: string;
    legalAddress: string;
    tenantType: TenantType;
}
