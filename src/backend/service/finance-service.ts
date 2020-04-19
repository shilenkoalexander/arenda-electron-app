import { generatePeriodsArray, parseDate, parseMonth } from '@/utils/date-utils';
import { addMonths, isAfter, isEqual, subMonths } from 'date-fns';
import {
    getFinancePeriod,
    getInflationIndexes,
    getMonthDebt,
    isNeverCalculated,
} from '@/backend/repository/finance-repository';
import { FinancePeriod } from '@/types/finance';
import { getPaymentContractInfo } from '@/backend/repository/contract-repository';
import { isNotEmpty } from '@/backend/utils/other-util';

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
                subMonths(value, 1),
                contractId,
            );
        }


    });
}

// если первый платеж - нужно учитывать дату актуальности платы из договора и умножать на индексы инфляции
export function calculate(period: string, contractId: number) {
    const periodDate = parseMonth(period);
    console.log('period =', period);

    if (isNeverCalculated(contractId)) {
        console.log('Never Calculated');
        const paymentContractInfo = getPaymentContractInfo(contractId);
        const indexNeedDates = generatePeriodsArray(
            addMonths(parseDate(paymentContractInfo.actualityDate), 1),
            periodDate,
        );
        const inflationIndexes = getInflationIndexes(indexNeedDates);
        let finalIndex = 1;

        if (isNotEmpty(inflationIndexes)) {
            finalIndex = inflationIndexes
                .map((value) => value.index)
                .reduce((previousValue, currentValue) => previousValue * currentValue);
        }
        const payment = paymentContractInfo.payment * finalIndex;

        console.log('payment =', payment.toFixed(2));
        return;
    }

    const financePeriodOptional = getFinancePeriod(subMonths(periodDate, 1), contractId);

    if (financePeriodOptional.isPresent()) {
        const financePeriod = financePeriodOptional.get();

    }
}
