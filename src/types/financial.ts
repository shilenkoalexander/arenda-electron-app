export interface FinancialPeriod {
    date: string;
    accruals: number; // начисления
    adjustments: number; // корректировки
    payments: number; // оплаты
    debt: number; // долг
    fine: number; // пеня
}
