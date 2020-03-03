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
    id: number;
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
    dispositionDate: Date;
    dispositionNumber: string;
    dispositionMaker: string;
}
