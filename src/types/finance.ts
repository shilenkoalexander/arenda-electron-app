import Period from '@/backend/utils/period';

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
