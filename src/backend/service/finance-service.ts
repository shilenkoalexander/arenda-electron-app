import { formatDateToDefaultFormat, generatePeriodsArray, parseMonth } from '@/utils/date-utils';
import { isAfter, isEqual, subMonths } from 'date-fns';
import { getMonthDebt, isNeverCalculated } from '@/backend/repository/finance-repository';
import { FinancePeriod } from '@/types/finance';
import { getTotalPayment } from '@/backend/repository/objects-repository';

export function recalculate(periodFrom: string, periodTo: string, contractId: number, save: boolean) {
    const periodFromDate = parseMonth(periodFrom);
    const periodToDate = parseMonth(periodTo);

    if (isAfter(periodFromDate, periodToDate)) {
        return;
    }

    const periods = generatePeriodsArray(periodFromDate, periodToDate);
    const financePeriods: FinancePeriod[] = [];
    // let previousMonthFinancePeriod: FinancePeriod | null = null;

    periods.forEach((value) => {
        let previousMonthDept = -1;
        if (isEqual(value, periodFromDate)) {
            previousMonthDept = getMonthDebt(
                formatDateToDefaultFormat(subMonths(value, 1)),
                contractId,
            );
        }


    });
}


// если первый платеж - нужно учитывать дату актуальности платы из договора и умножать на индексы инфляции
export function calculate(period: string, contractId: number) {
    const periodDate = parseMonth(period);

    if (isNeverCalculated(contractId)) {
        const payment = getTotalPayment(contractId);
    }
}
