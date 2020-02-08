export interface ShortObjectDetails {
    id: number;
    objectIndividualInformation: Record<string, string>;
    address: string;
    onBalance: string;
    payment: number;
    rentalRate: number;
    businessType: string;
    startDate: Date;
    endDate: Date;
    subtenantsCount: number;
}
