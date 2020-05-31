import Period from '@/model/utils/period';

export interface FinancePeriod {
    period: Period;
    accruals: number; // начисления
    adjustments: number; // корректировки
    payments: number; // оплаты
    debt: number; // долг
}

export interface PaymentContractInfo {
    payment: number;
    actualityDate: Date;
    startDate: Date;
}

export interface InflationIndex {
    index: number;
    period: string;
    date: string;
}

export interface Payment {
    sum: number;
    period: Period;
    date: Date;
}

export interface IndexingSign {
    id: number;
    period: Period;
    indexing: boolean;
}

