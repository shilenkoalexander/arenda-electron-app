import { Subtenant } from '@/types/tenants';

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
    id: number;
    address: string;
    square: number;
    payment: number;
    rentalRate: number;
}

export interface FullObjectDetails {
    id: number;
    businessType: string;
    area: string;
    objectIndividualInformation: Record<string, string> | null;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    startDate: Date;
    endDate: Date;
    expertReviewSum: number;
    expertReviewDate: Date;
    subtenants: Subtenant[];
    square: number; // todo добавить поле в базу
    /*dispositionDate: Date; // TODO удалить их из базы. эти поля на уровне договора
    dispositionNumber: number;
    dispositionMaker: string;*/
}
