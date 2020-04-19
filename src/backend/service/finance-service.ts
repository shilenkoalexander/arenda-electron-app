import { formatDateToMonthString, generatePeriodsArray, parseMonth } from '@/utils/date-utils';
import {
    addMonths,
    differenceInDays,
    endOfMonth,
    getDaysInMonth,
    isAfter,
    isEqual,
    startOfMonth,
    subMonths,
} from 'date-fns';
import {
    getFinancePeriod,
    getInflationIndexes,
    getMonthDebt,
    isNeverCalculated,
} from '@/backend/repository/finance-repository';
import { FinancePeriod } from '@/types/finance';
import {
    getContractExtensionPaymentActivatesInPeriod,
    getPaymentContractInfo,
} from '@/backend/repository/contract-repository';
import { isEmpty, isNotEmpty } from '@/backend/utils/other-util';
import { ContractExtension } from '@/backend/types/contract-types';

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

function getInflationIndex(period: Date): number {
    const inflationIndexes = getInflationIndexes([period]);

    if (isEmpty(inflationIndexes)) {
        throw new Error(`Отсутствует индекс инфляции для периода ${formatDateToMonthString(period)}`);
    }

    return inflationIndexes[0].index;
}

function getFinalInflationIndexByPeriods(startDate: Date, endDate: Date): number {
    const indexNeedDates = generatePeriodsArray(startDate, endDate);
    const inflationIndexes = getInflationIndexes(indexNeedDates);
    let finalIndex = 1;

    if (isNotEmpty(inflationIndexes)) {
        finalIndex = inflationIndexes
            .map((value) => value.index)
            .reduce((previousValue, currentValue) => previousValue * currentValue);
    }

    return finalIndex;
}

function getAccrualWhenNeverCalculated(period: Date, contractId: number): number {
    console.log('Never Calculated');
    const paymentContractInfoOptional = getPaymentContractInfo(contractId);

    if (!paymentContractInfoOptional.isPresent()) {
        throw new Error(`Отсутствует информация о договоре с id = ${contractId}`);
    }

    const paymentContractInfo = paymentContractInfoOptional.get();
    const finalIndex = getFinalInflationIndexByPeriods(addMonths(paymentContractInfo.actualityDate, 1), period);

    return paymentContractInfo.payment * finalIndex;
}

function getAccrualWhenPrevMonthCalculated(prevFinancePeriod: FinancePeriod, period: Date, contractId: number): number {
    console.log('Calculated prev month');
    const inflationIndex = getInflationIndex(period);
    const prevMonthContractExtensionOptional = getContractExtensionPaymentActivatesInPeriod(
        subMonths(period, 1),
        contractId,
    );

    if (prevMonthContractExtensionOptional.isPresent()) {
        const prevMonthContractExtension = prevMonthContractExtensionOptional.get();
        return prevMonthContractExtension.rentPayment * inflationIndex;
    }

    return prevFinancePeriod.payments * inflationIndex;
}

function getAccrualWhenContractExtensionActivatesThisPeriod(
    contractExtension: ContractExtension,
    prevFinancePeriod: FinancePeriod,
    period: Date,
): number {
    console.log('When contract extension');
    const prevPaymentDays = differenceInDays(contractExtension.dateStart, startOfMonth((period)));
    const currPaymentDays = differenceInDays(endOfMonth(period), contractExtension.dateStart) + 1;
    const monthDaysCount = getDaysInMonth(period);
    const periodInflationIndex = getInflationIndex(period);
    const extensionInflationIndex = getFinalInflationIndexByPeriods(
        addMonths(contractExtension.paymentActualityDate, 1),
        period,
    );

    const prevAccrualWithInflationIndex = prevFinancePeriod.accruals * periodInflationIndex;
    const currAccrualWithInflationIndex = contractExtension.rentPayment * extensionInflationIndex;

    const accrualBeforeExtension = (prevAccrualWithInflationIndex / monthDaysCount) * prevPaymentDays;
    const accrualAfterExtension = (currAccrualWithInflationIndex / monthDaysCount) * currPaymentDays;

    return accrualBeforeExtension + accrualAfterExtension;
}

// если первый платеж - нужно учитывать дату актуальности платы из договора и умножать на индексы инфляции
export function calculate(period: string, contractId: number) {
    const periodDate = parseMonth(period);
    console.log('period =', period);
    let payment;

    if (isNeverCalculated(contractId)) {
        payment = getAccrualWhenNeverCalculated(periodDate, contractId);
    }

    const activeContractExtensionPayment = getContractExtensionPaymentActivatesInPeriod(periodDate, contractId);
    const financePeriodOptional = getFinancePeriod(subMonths(periodDate, 1), contractId);

    if (activeContractExtensionPayment.isPresent()) {
        payment = getAccrualWhenContractExtensionActivatesThisPeriod(
            activeContractExtensionPayment.get(),
            financePeriodOptional.get(),
            periodDate,
        );
    } else if (financePeriodOptional.isPresent()) {
        payment = getAccrualWhenPrevMonthCalculated(financePeriodOptional.get(), periodDate, contractId);
    }

    if (payment) {
        console.log('payment =', payment.toFixed(2));
    } else {
        console.log('GOVNO');
    }
}
