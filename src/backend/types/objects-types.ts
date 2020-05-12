import { Subtenant } from '@/backend/types/tenants-types';
import { AssociativeArrayItem } from '@/types/common';

export interface ShortObjectDetails {
    id: number;
    objectIndividualInformation: Record<string, string> | null;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    businessType: string;
    startDate: string;
    endDate: string;
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
    startDate: string;
    endDate: string;
    expertReviewSum: number;
    expertReviewDate: string;
    subtenants: Subtenant[];
    objectType: string;
    decisionDate: string;
    decisionNumber: string;
    decisionMaker: string;
}

export interface AddObjectDto {
    index: number;
    businessTypeId: number;
    areaId: number;
    objectIndividualInformation: AssociativeArrayItem[];
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    startDate: string;
    endDate: string;
    expertReviewSum: number;
    expertReviewDate: string;
    subtenants: Subtenant[];
    objectType: string;
    decisionDate: string;
    decisionNumber: string;
    decisionMaker: string;
}
