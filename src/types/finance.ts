export interface FinancePeriod {
    period: string;
    accruals: number; // начисления
    adjustments: number; // корректировки
    payments: number; // оплаты
    debt: number; // долг
}
