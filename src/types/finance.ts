export interface FinancePeriod {
    period: string;
    accruals: number; // начисления
    adjustments: number; // корректировки
    payments: number; // оплаты
    debt: number; // долг
}

export interface PaymentContractInfo {
    payment: number;
    actualityDate: Date;
}

export interface InflationIndex {
    index: number;
    period: string;
    date: string;
}
