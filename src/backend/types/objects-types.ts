import { EditSubtenantDto, SubtenantWithObjectId } from '@/backend/types/tenants-types';
import { Directory } from '@/backend/types/common-types';

export interface ShortObjectDetails {
    id: number;
    objectIndividualInformation: ObjectInformation[];
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
    businessType: Directory;
    area: Directory;
    objectIndividualInformation: ObjectInformation[];
    address: string;
    onBalance: string;
    payment: number;
    square: number | null;
    rentalRate: number;
    startDate: Date;
    endDate: Date;
    expertReviewSum: number;
    expertReviewDate: Date;
    objectType: string;
    decisionDate: Date;
    decisionNumber: string;
    decisionMaker: string;
}

export interface FullObjectDetailsWithSubtenants extends FullObjectDetails {
    id: number;
    subtenants: SubtenantWithObjectId[];
}

export interface EditObjectDto extends FullObjectDetails {
    id: number | null;
    subtenants: EditSubtenantDto[];
}

export interface ObjectInformation {
    id: number | null;
    objectId: number | null;
    name: string;
    value: string;
}
