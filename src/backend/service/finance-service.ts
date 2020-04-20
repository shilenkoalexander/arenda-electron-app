import { formatDateToMonthString, generatePeriodsArray, parseMonth } from '@/utils/date-utils';
import {
    addMonths,
    differenceInDays,
    endOfMonth,
    getDaysInMonth,
    isAfter,
    isEqual,
    isSameMonth,
    startOfMonth,
    subMonths,
} from 'date-fns';
import {
    getContractStartDate,
    getFinancePeriod,
    getInflationIndexes,
    getMonthDebt,
} from '@/backend/repository/finance-repository';
import { FinancePeriod } from '@/types/finance';
import {
    getContractExtensionPaymentActivatesInPeriod,
    getContractExtensionPaymentDeactivatesInPeriod,
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

function isFirstCalculation(period: Date, contractId: number) {
    const contractStartDate = getContractStartDate(contractId);
    return isSameMonth(contractStartDate, period);
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

    if (isEmpty(indexNeedDates)) {
        return 1;
    }

    const inflationIndexes = getInflationIndexes(indexNeedDates);
    let finalIndex = 1;

    if (isNotEmpty(inflationIndexes)) {
        finalIndex = inflationIndexes
            .map((value) => value.index)
            .reduce((previousValue, currentValue) => previousValue * currentValue);
    }

    return finalIndex;
}

/**
 * Возвращает начисление за полный месяц
 * Если передаваемый период - первый расчетный период - берем из договора и умножаем на индекс инфляции (ии)
 * Если в передаваемый период началось доп соглашение, то берем сумму из доп соглашения и умножаем на ии
 * Если в передаваемый период закончилось доп соглашение, то берем сумму из периода перед доп соглашением
 * и умножаем на все ии за период действия доп соглашения + текущий
 * @param period
 * @param contractId
 */
export function getAccrualPerFullMonthByPeriod(period: Date, contractId: number): number { // убрать экспорт
    // debugger;
    console.log('период ', formatDateToMonthString(period));

    if (isFirstCalculation(period, contractId)) { // если этот период - начало договора
        console.log('из договора');
        const paymentContractInfo = getPaymentContractInfo(contractId)
            .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
        const finalIndex = getFinalInflationIndexByPeriods(
            addMonths(paymentContractInfo.actualityDate, 1),
            period,
        );
        return paymentContractInfo.payment * finalIndex; // то берем из договора
    }

    const inflationIndex = getInflationIndex(period);
    const contractExtensionPaymentActivatesInPeriod = getContractExtensionPaymentActivatesInPeriod(period, contractId);

    if (contractExtensionPaymentActivatesInPeriod.isPresent()) { // если в этот месяц был активирован доп договор
        console.log('активирован доп договор');
        return getAccrualPerFullMonthByPeriod(subMonths(period, 1), contractId) * inflationIndex;
        // то возвращаемся на один месяц назад и оттуда значение умножаем на индекс инфляции текущий
    }

    const contractExtensionPaymentDeactivatesInPeriod = getContractExtensionPaymentDeactivatesInPeriod(
        period,
        contractId,
    );
    if (contractExtensionPaymentDeactivatesInPeriod.isPresent()) { // если доп соглашение деактивировано
        console.log('деактивирован доп договор');
        const contractExtension = contractExtensionPaymentDeactivatesInPeriod.get();
        // то идем в месяц перед началом доп соглашения
        return getAccrualPerFullMonthByPeriod(subMonths(contractExtension.dateStart, 1), contractId) * inflationIndex;
    }

    console.log('получаем из периода');
    return getFinancePeriod(period, contractId)
        .map((value) => value.accruals * inflationIndex)
        .orElseThrowWithMessage(`Отсутствует информация о периоде ${formatDateToMonthString(period)}`);
}


function getAccrualWhenFirstCalculation(period: Date, contractId: number): number {
    console.log('Never Calculated');
    const paymentContractInfo = getPaymentContractInfo(contractId)
        .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
    const finalIndex = getFinalInflationIndexByPeriods(addMonths(paymentContractInfo.actualityDate, 1), period);

    if (!isSameMonth(paymentContractInfo.startDate, period)) {
        throw new Error(`Дата начала действия договора (${formatDateToMonthString(paymentContractInfo.startDate)}) ` +
            `не совпадает с периодом расчета (${period})`);
    }

    const calculatedDaysCount = differenceInDays(endOfMonth(period), paymentContractInfo.startDate) + 1;
    const daysInMonth = getDaysInMonth(period);

    return (paymentContractInfo.payment * finalIndex) / daysInMonth * calculatedDaysCount;
}

function getAccrualWhenPrevMonthCalculated(period: Date, contractId: number, prevFinancePeriod: FinancePeriod): number {
    console.log('Calculated prev month');

    const prevPeriod = subMonths(period, 1);

    if (isFirstCalculation(prevPeriod, contractId)) {
        const paymentContractInfo = getPaymentContractInfo(contractId)
            .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
        const finalInflationIndex = getFinalInflationIndexByPeriods(
            addMonths(paymentContractInfo.actualityDate, 1),
            period,
        );

        return paymentContractInfo.payment * finalInflationIndex;
    }

    const prevMonthContractExtensionDeactivatesOptional = getContractExtensionPaymentDeactivatesInPeriod(
        prevPeriod,
        contractId,
    );

    if (prevMonthContractExtensionDeactivatesOptional.isPresent()) {
        console.log('extension deactivates prev month');
        const contractExtension = prevMonthContractExtensionDeactivatesOptional.get();
        const periodBeforeExtension = subMonths(contractExtension.dateStart, 1);
        const financePeriodBeforeExtension = getFinancePeriod(periodBeforeExtension, contractId)
            .orElseThrowWithMessage('Отсутствует информация о периоде до начала действия доп соглашения');
        const finalInflationIndex = getFinalInflationIndexByPeriods(contractExtension.dateStart, period);

        return financePeriodBeforeExtension.accruals * finalInflationIndex;
    }

    const inflationIndex = getInflationIndex(period);
    const prevMonthContractExtensionActivatesOptional = getContractExtensionPaymentActivatesInPeriod(
        prevPeriod,
        contractId,
    );

    if (prevMonthContractExtensionActivatesOptional.isPresent()) {
        const prevMonthContractExtension = prevMonthContractExtensionActivatesOptional.get();
        return prevMonthContractExtension.rentPayment * inflationIndex;
    }


    return prevFinancePeriod.accruals * inflationIndex;
}

function getAccrualWhenContractExtensionActivatesThisPeriod(
    period: Date,
    contractExtension: ContractExtension,
    prevFinancePeriod: FinancePeriod,
): number {
    console.log('When contract extension start');
    const prevPaymentDays = differenceInDays(contractExtension.dateStart, startOfMonth((period)));
    const currPaymentDays = differenceInDays(endOfMonth(period), contractExtension.dateStart) + 1;

    console.log('Дней до =', prevPaymentDays);
    console.log('Дней после =', currPaymentDays);

    const monthDaysCount = getDaysInMonth(period);
    const periodInflationIndex = getInflationIndex(period);
    const extensionInflationIndex = getFinalInflationIndexByPeriods(
        addMonths(contractExtension.paymentActualityDate, 1),
        period,
    );

    const prevAccrualWithInflationIndex = prevFinancePeriod.accruals * periodInflationIndex;
    const currAccrualWithInflationIndex = contractExtension.rentPayment * extensionInflationIndex;

    console.log('Предыдущ за весь месяц начисление =', prevPaymentDays);
    console.log('Следующее за весь месяц начисление =', currAccrualWithInflationIndex);

    const accrualBeforeExtension = (prevAccrualWithInflationIndex / monthDaysCount) * prevPaymentDays;
    const accrualAfterExtension = (currAccrualWithInflationIndex / monthDaysCount) * currPaymentDays;

    console.log('Предыдущ общее начисление =', accrualBeforeExtension);
    console.log('Следующее общее начисление =', accrualAfterExtension);

    return accrualBeforeExtension + accrualAfterExtension;
}

function getAccrualWhenContractExtensionDeactivatesThisPeriod(
    period: Date,
    contractId: number,
    contractExtension: ContractExtension,
): number {
    console.log('When contract extension end');
    const prevPaymentDays = differenceInDays(contractExtension.dateEnd, startOfMonth((period))) + 1;
    const currPaymentDays = differenceInDays(endOfMonth(period), contractExtension.dateEnd);

    console.log('Дней до =', prevPaymentDays);
    console.log('Дней после =', currPaymentDays);

    const monthDaysCount = getDaysInMonth(period);
    const periodInflationIndex = getInflationIndex(period);
    const periodBeforeExtension = subMonths(contractExtension.dateStart, 1);

    const prevPeriod = subMonths(period, 1);

    const prevFinancePeriod = getFinancePeriod(prevPeriod, contractId)
        .orElseThrowWithMessage(`Отсутствует информация о периоде ${formatDateToMonthString(prevPeriod)}`);
    const financePeriodBeforeExtension = getFinancePeriod(periodBeforeExtension, contractId)
        .orElseThrowWithMessage('Отсутствует информация о периоде до начала действия доп соглашения');

    const extensionInflationIndex = getFinalInflationIndexByPeriods(
        contractExtension.dateStart,
        period,
    );

    const prevAccrualWithInflationIndex = prevFinancePeriod.accruals * periodInflationIndex;
    const currAccrualWithInflationIndex = financePeriodBeforeExtension.accruals * extensionInflationIndex;

    console.log('Предыдущ за весь месяц начисление =', prevAccrualWithInflationIndex);
    console.log('Следующее за весь месяц начисление =', currAccrualWithInflationIndex);

    const accrualBeforeExtension = (prevAccrualWithInflationIndex / monthDaysCount) * prevPaymentDays;
    const accrualAfterExtension = (currAccrualWithInflationIndex / monthDaysCount) * currPaymentDays;

    console.log('Предыдущ общее начисление =', accrualBeforeExtension);
    console.log('Следующее общее начисление =', accrualAfterExtension);

    return accrualBeforeExtension + accrualAfterExtension;
}

// если первый платеж - нужно учитывать дату актуальности платы из договора и умножать на индексы инфляции
export function calculate(period: string, contractId: number): number {
    const periodDate = parseMonth(period);
    console.log('period =', period);

    if (isFirstCalculation(periodDate, contractId)) {
        return getAccrualWhenFirstCalculation(periodDate, contractId);
    }

    const extensionActivatesThisPeriod = getContractExtensionPaymentActivatesInPeriod(periodDate, contractId);
    const financePeriodOptional = getFinancePeriod(subMonths(periodDate, 1), contractId);

    if (extensionActivatesThisPeriod.isPresent()) {
        return getAccrualWhenContractExtensionActivatesThisPeriod(
            periodDate,
            extensionActivatesThisPeriod.get(),
            financePeriodOptional.get(),
        );
    }

    const extensionDeactivatesThisPeriod = getContractExtensionPaymentDeactivatesInPeriod(periodDate, contractId);

    if (extensionDeactivatesThisPeriod.isPresent()) {
        return getAccrualWhenContractExtensionDeactivatesThisPeriod(
            periodDate,
            contractId,
            extensionDeactivatesThisPeriod.get(),
        );
    }

    if (financePeriodOptional.isPresent()) {
        return getAccrualWhenPrevMonthCalculated(periodDate, contractId, financePeriodOptional.get());
    }

    throw new Error('Ошибка расчета');
}
