import { Subtenant } from '@/types/tenants';
import { AssociativeArrayItem } from '@/types/common';

export interface ShortObjectDetails {
    id: number;
    objectIndividualInformation: Record<string, string> | null;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    businessType: string;
    startDate: Date;
    endDate: Date;
    subtenantsCount: number;
}

export interface BasicObjectInfo {
    address: string;
    objectType: string;
    payment: number;
    rentalRate: number;
}

export interface FullObjectDetails {
    id: number;
    businessType: string;
    area: string;
    objectIndividualInformation: AssociativeArrayItem[] | null;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    startDate: Date;
    endDate: Date;
    expertReviewSum: number;
    expertReviewDate: Date;
    subtenants: Subtenant[];
    objectType: string; // todo добавить в базу
    decisionDate: Date;
    decisionNumber: string;
    decisionMaker: string;
}

// todo заменить таблицы payments, accruals и остальные на одну

export interface AddObjectDto {
    businessType: string;
    areaId: number;
    objectIndividualInformation: AssociativeArrayItem[] | null;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    startDate: Date;
    endDate: Date;
    expertReviewSum: number;
    expertReviewDate: Date;
    subtenants: Subtenant[];
    objectType: string; // todo добавить в базу
    decisionDate: Date;
    decisionNumber: string;
    decisionMaker: string;
}
