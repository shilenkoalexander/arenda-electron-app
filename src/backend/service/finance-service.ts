import { formatDateToMonthString, generatePeriodsArray } from '@/utils/date-utils';
import { differenceInDays, isSameMonth } from 'date-fns';
import { getContractStartDate, getFinancePeriod, getInflationIndexes } from '@/backend/repository/finance-repository';
import {
    getContractExtensionPaymentActivatesInPeriod,
    getContractExtensionPaymentDeactivatesInPeriod,
    getPaymentContractInfo,
} from '@/backend/repository/contract-repository';
import { isEmpty, isNotEmpty } from '@/backend/utils/other-util';
import { ContractExtension } from '@/backend/types/contract-types';
import Period from '@/backend/utils/period';

/*export function recalculate(periodFrom: string, periodTo: string, contractId: number, save: boolean) {
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
}*/

function isFirstCalculation(period: Period, contractId: number) {
    const contractStartDate = getContractStartDate(contractId);
    return isSameMonth(contractStartDate, period.getDate());
}

function getInflationIndex(period: Period): number {
    const inflationIndexes = getInflationIndexes([period]);

    if (isEmpty(inflationIndexes)) {
        throw new Error(`Отсутствует индекс инфляции для периода ${period.toFriendlyFormat()}`);
    }

    return inflationIndexes[0].index;
}

function getFinalInflationIndexByPeriods(startPeriod: Period, endPeriod: Period): number {
    const indexNeedDates = generatePeriodsArray(startPeriod, endPeriod);

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
export function getAccrualPerFullMonthByPeriod(period: Period, contractId: number): number {
    console.log('период ', period.toFriendlyFormat());

    if (isFirstCalculation(period, contractId)) { // если этот период - начало договора
        console.log('из договора');
        const paymentContractInfo = getPaymentContractInfo(contractId)
            .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
        const finalIndex = getFinalInflationIndexByPeriods(
            Period.ofDate(paymentContractInfo.actualityDate).addMonths(1),
            period,
        );
        return paymentContractInfo.payment * finalIndex; // то берем из договора
    }

    const contractExtensionPaymentActivatesInPeriod = getContractExtensionPaymentActivatesInPeriod(period, contractId);

    if (contractExtensionPaymentActivatesInPeriod.isPresent()) { // если в этот месяц был активирован доп договор
        console.log('активирован доп соглашение');
        const extension = contractExtensionPaymentActivatesInPeriod.get();
        const extensionInflationIndex = getFinalInflationIndexByPeriods(
            Period.ofDate(extension.paymentActualityDate).addMonths(1),
            period,
        );
        return extension.rentPayment * extensionInflationIndex;
        // то берем сумму из доп соглашения и умножаем на два индекса инфляции
    }

    const contractExtensionPaymentDeactivatesInPeriod = getContractExtensionPaymentDeactivatesInPeriod(
        period,
        contractId,
    );
    if (contractExtensionPaymentDeactivatesInPeriod.isPresent()) { // если доп соглашение деактивировано
        console.log('деактивирован доп договор');
        const contractExtension = contractExtensionPaymentDeactivatesInPeriod.get();
        // то идем в месяц перед началом доп соглашения
        const finalIndex = getFinalInflationIndexByPeriods(
            Period.ofDate(contractExtension.dateStart),
            period,
        );
        return getAccrualPerFullMonthByPeriod(
            Period.ofDate(contractExtension.dateStart).subMonths(1),
            contractId,
        ) * finalIndex;
    }

    console.log('получаем из периода');
    return getFinancePeriod(period, contractId)
        .map((value) => value.accruals)
        .orElseThrowWithMessage(`Отсутствует информация о периоде ${period.toFriendlyFormat()}`);
}

function getAccrualWhenFirstCalculation(period: Period, contractId: number): number {
    console.log('Never Calculated');
    const paymentContractInfo = getPaymentContractInfo(contractId)
        .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
    const finalIndex = getFinalInflationIndexByPeriods(
        Period.ofDate(paymentContractInfo.actualityDate).addMonths(1),
        period,
    );

    if (!isSameMonth(paymentContractInfo.startDate, period.getDate())) {
        throw new Error(`Дата начала действия договора (${formatDateToMonthString(paymentContractInfo.startDate)}) ` +
            `не совпадает с периодом расчета (${period})`);
    }

    const calculatedDaysCount = differenceInDays(period.endOfMonth(), paymentContractInfo.startDate) + 1;
    const daysInMonth = period.getDaysInMonth();

    return (paymentContractInfo.payment * finalIndex) / daysInMonth * calculatedDaysCount;
}

function getAccrualWhenPrevMonthCalculated(
    period: Period,
    contractId: number,
): number {
    console.log('Calculated prev month');

    const prevPeriod = period.subMonths(1);

    const prevFinancePeriodAccruals = getAccrualPerFullMonthByPeriod(prevPeriod, contractId);
    const inflationIndex = getInflationIndex(period);

    return prevFinancePeriodAccruals * inflationIndex;
}

function getAccrualWhenContractExtensionActivatesThisPeriod(
    period: Period,
    contractExtension: ContractExtension,
    contractId: number,
): number {
    console.log('When contract extension start');
    const prevPaymentDays = differenceInDays(contractExtension.dateStart, period.startOfMonth());
    const currPaymentDays = differenceInDays(period.endOfMonth(), contractExtension.dateStart) + 1;

    console.log('Дней до =', prevPaymentDays);
    console.log('Дней после =', currPaymentDays);

    const monthDaysCount = period.getDaysInMonth();
    const periodInflationIndex = getInflationIndex(period);
    const extensionInflationIndex = getFinalInflationIndexByPeriods(
        Period.ofDate(contractExtension.paymentActualityDate).addMonths(1),
        period,
    );

    const prevFinancePeriodAccruals = getAccrualPerFullMonthByPeriod(period.subMonths(1), contractId);

    const prevAccrualWithInflationIndex = prevFinancePeriodAccruals * periodInflationIndex;
    const currAccrualWithInflationIndex = contractExtension.rentPayment * extensionInflationIndex;

    console.log('Предыдущ за весь месяц начисление =', prevAccrualWithInflationIndex.toFixed(4));
    console.log('Следующее за весь месяц начисление =', currAccrualWithInflationIndex.toFixed(4));

    const accrualBeforeExtension = (prevAccrualWithInflationIndex / monthDaysCount) * prevPaymentDays;
    const accrualAfterExtension = (currAccrualWithInflationIndex / monthDaysCount) * currPaymentDays;

    console.log('Предыдущ общее начисление =', accrualBeforeExtension.toFixed(4));
    console.log('Следующее общее начисление =', accrualAfterExtension.toFixed(4));

    return accrualBeforeExtension + accrualAfterExtension;
}

function getAccrualWhenContractExtensionDeactivatesThisPeriod(
    period: Period,
    contractId: number,
    contractExtension: ContractExtension,
): number {
    console.log('When contract extension end');
    const prevPaymentDays = differenceInDays(contractExtension.dateEnd, period.startOfMonth()) + 1;
    const currPaymentDays = differenceInDays(period.endOfMonth(), contractExtension.dateEnd);

    console.log('Дней до =', prevPaymentDays);
    console.log('Дней после =', currPaymentDays);

    const monthDaysCount = period.getDaysInMonth();
    const periodInflationIndex = getInflationIndex(period);
    const periodBeforeExtension = Period.ofDate(contractExtension.dateStart).subMonths(1);

    const extensionInflationIndex = getFinalInflationIndexByPeriods(
        Period.ofDate(contractExtension.dateStart),
        period,
    );

    const beforeExtensionPeriodAccruals = getAccrualPerFullMonthByPeriod(periodBeforeExtension, contractId);
    const prevFinancePeriodAccruals = getAccrualPerFullMonthByPeriod(period.subMonths(1), contractId);

    const prevAccrualWithInflationIndex = prevFinancePeriodAccruals * periodInflationIndex;
    const currAccrualWithInflationIndex = beforeExtensionPeriodAccruals * extensionInflationIndex;

    console.log('Предыдущ за весь месяц начисление =', prevAccrualWithInflationIndex);
    console.log('Следующее за весь месяц начисление =', currAccrualWithInflationIndex);

    const accrualBeforeExtension = (prevAccrualWithInflationIndex / monthDaysCount) * prevPaymentDays;
    const accrualAfterExtension = (currAccrualWithInflationIndex / monthDaysCount) * currPaymentDays;

    console.log('Предыдущ общее начисление =', accrualBeforeExtension);
    console.log('Следующее общее начисление =', accrualAfterExtension);

    return accrualBeforeExtension + accrualAfterExtension;
}

// если первый платеж - нужно учитывать дату актуальности платы из договора и умножать на индексы инфляции
export function calculate(period: Period, contractId: number): number {
    console.log('period =', period.toDefaultFormat());

    if (isFirstCalculation(period, contractId)) {
        return getAccrualWhenFirstCalculation(period, contractId);
    }

    const extensionActivatesThisPeriod = getContractExtensionPaymentActivatesInPeriod(period, contractId);

    if (extensionActivatesThisPeriod.isPresent()) {
        return getAccrualWhenContractExtensionActivatesThisPeriod(
            period,
            extensionActivatesThisPeriod.get(),
            contractId,
        );
    }

    const extensionDeactivatesThisPeriod = getContractExtensionPaymentDeactivatesInPeriod(period, contractId);

    if (extensionDeactivatesThisPeriod.isPresent()) {
        return getAccrualWhenContractExtensionDeactivatesThisPeriod(
            period,
            contractId,
            extensionDeactivatesThisPeriod.get(),
        );
    }

    return getAccrualWhenPrevMonthCalculated(period, contractId);
}
