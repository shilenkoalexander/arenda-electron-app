import { generatePeriodsArray } from '@/utils/date-utils';
import { differenceInDays, isSameMonth } from 'date-fns';
import {
    getContractStartCalculationDate,
    getFinancePeriod, getIndexingSigns,
    getInflationIndexesByPeriods,
    getMonthDebt,
    getPeriodsAdjustments,
    getPeriodsPayments,
} from '@/backend/repository/finance-repository';
import { getContractExtensions, getPaymentContractInfo } from '@/backend/repository/contract-repository';
import { isEmpty, isNotEmpty } from '@/backend/utils/other-util';
import { ContractExtension } from '@/backend/types/contract-types';
import Period, { isSamePeriods } from '@/backend/utils/period';
import { FinancePeriod, InflationIndex } from '@/types/finance';
import Optional from '@/backend/utils/optional';
import { FullContractExtension } from '@/types/contracts';
import logger from 'vuex/dist/logger';

let calculatedPeriods: FinancePeriod[] = [];
let localContractExtensions: ContractExtension[] = [];
let inflationIndexes: InflationIndex[] = [];

function getContractExtensionsByPeriod(period: Period): ContractExtension[] {
    return localContractExtensions
        .filter((value) =>
            Period.ofDate(value.dateStart).isSamePeriod(period)
            || Period.ofDate(value.dateEnd).isSamePeriod(period),
        );
}

function getContractExtensionActivatesInPeriod(period: Period): Optional<ContractExtension> {
    const result = localContractExtensions
        .find((value) =>
            !isSamePeriods(value.dateStart, value.dateEnd)
            && Period.ofDate(value.dateStart).isSamePeriod(period),
        );
    return Optional.of(result);
}

function getContractExtensionDeactivatesInPeriod(period: Period): Optional<ContractExtension> {
    const result = localContractExtensions
        .find((value) =>
            !isSamePeriods(value.dateStart, value.dateEnd)
            && Period.ofDate(value.dateEnd).isSamePeriod(period),
        );
    return Optional.of(result);
}

function getFinancePeriodFromLocalIfFound(period: Period, contractId: number): FinancePeriod {
    const localFinancePeriod = calculatedPeriods.find((value) => period.isSamePeriod(value.period));

    if (!localFinancePeriod) {
        return getFinancePeriod(period, contractId)
            .orElseThrowWithMessage(`Отсутствует информация о периоде ${period.toFriendlyFormat()}`);
    }
    return localFinancePeriod;
}

function isFirstCalculation(period: Period, contractId: number) {
    const contractStartDate = getContractStartCalculationDate(contractId);
    return isSameMonth(contractStartDate, period.getDate());
}

function getInflationIndex(period: Period): number {
    const index = inflationIndexes
        .find((value) => period.isSamePeriod(Period.ofString(value.period)));

    if (!index) {
        throw new Error(`Отсутствует индекс инфляции для периода ${period.toFriendlyFormat()}`);
    }

    return index.index;
}

function getFinalInflationIndexByPeriods(startPeriod: Period, endPeriod: Period): number {
    const indexNeedPeriods = generatePeriodsArray(startPeriod, endPeriod);

    const indexes = inflationIndexes
        .filter(
            (index) => indexNeedPeriods
                .some((needPeriod) => needPeriod.isSamePeriod(Period.ofString(index.period))),
        );
    let finalIndex = 1;

    if (isNotEmpty(indexes)) {
        finalIndex = indexes
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

    if (getContractExtensionsByPeriod(period).length > 0) {
        return getAccrualPerFullMonthByPeriod(period.subMonths(1), contractId) * getInflationIndex(period);
    }

    const contractExtensionPaymentActivatesInPeriod = getContractExtensionActivatesInPeriod(period);

    if (contractExtensionPaymentActivatesInPeriod.isPresent()
        && !Period.ofDate(contractExtensionPaymentActivatesInPeriod.get().dateEnd).isSamePeriod(period)) {
        // если в этот месяц был активирован доп договор
        console.log('активирован доп соглашение');
        const extension = contractExtensionPaymentActivatesInPeriod.get();
        const extensionInflationIndex = getFinalInflationIndexByPeriods(
            Period.ofDate(extension.paymentActualityDate).addMonths(1),
            period,
        );
        return extension.rentPayment * extensionInflationIndex;
        // то берем сумму из доп соглашения и умножаем на два индекса инфляции
    }

    const contractExtensionPaymentDeactivatesInPeriod = getContractExtensionDeactivatesInPeriod(period);
    if (contractExtensionPaymentDeactivatesInPeriod.isPresent()
        && !Period.ofDate(contractExtensionPaymentDeactivatesInPeriod.get().dateStart).isSamePeriod(period)) {
        // если доп соглашение деактивировано
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

    return getFinancePeriodFromLocalIfFound(period, contractId).accruals;
}

function getAccrualsByDaysCount(payment: number, daysCount: number, monthDaysCount: number) {
    return (payment / monthDaysCount) * daysCount;
}

// todo: проверить когда начинается и заканчивается доп соглашение в одном месяце, в разных, в одном и разных)
// todo: разобраться с ошибками электрона в консоси
// todo: как то придумать ограничение на фронте по датам перерасчета если расчета в принципе не было, а время прошло
function calculateAccruals(period: Period, contractId: number): number {
    const extensionsDuringPeriod = getContractExtensionsByPeriod(period);
    const contractStartCalculationDate = getContractStartCalculationDate(contractId);
    const isStartContractPeriod = isSameMonth(contractStartCalculationDate, period.getDate());

    let prevAccrualsPeriod;
    let calculateMonthDaysCount;
    let periodInflationIndex = 1;

    if (isStartContractPeriod) {
        calculateMonthDaysCount = differenceInDays(period.endOfMonth(), contractStartCalculationDate) + 1;
        prevAccrualsPeriod = period;
    } else {
        calculateMonthDaysCount = period.getDaysInMonth();
        prevAccrualsPeriod = period.subMonths(1);
        periodInflationIndex = getInflationIndex(period);
    }

    let extensionsTotalDaysCount = 0;
    let periodTotalAccruals = 0;

    extensionsDuringPeriod.forEach((value) => {
        let extensionDuration = 0;

        if (isSamePeriods(value.dateStart, value.dateEnd)) {
            extensionDuration = differenceInDays(value.dateEnd, value.dateStart) + 1;
        } else if (period.isSamePeriodByDate(value.dateStart)) {
            extensionDuration = differenceInDays(period.endOfMonth(), value.dateStart) + 1;
        } else if (period.isSamePeriodByDate(value.dateEnd)) {
            extensionDuration = differenceInDays(value.dateEnd, period.startOfMonth()) + 1;
        }

        const inflationIndex = getFinalInflationIndexByPeriods(
            Period.ofDate(value.paymentActualityDate).addMonths(1),
            period,
        );

        periodTotalAccruals += getAccrualsByDaysCount(
            value.rentPayment,
            extensionDuration,
            period.getDaysInMonth(),
        ) * inflationIndex;

        extensionsTotalDaysCount += extensionDuration;
    });


    const accrualWithoutExtensions = getAccrualPerFullMonthByPeriod(prevAccrualsPeriod, contractId);
    const daysWithoutExtensions = calculateMonthDaysCount - extensionsTotalDaysCount;
    const currentPeriodAccrualsWithoutExtensions = getAccrualsByDaysCount(
        accrualWithoutExtensions,
        daysWithoutExtensions,
        period.getDaysInMonth(),
    ) * periodInflationIndex;

    return currentPeriodAccrualsWithoutExtensions + periodTotalAccruals;
}

// todo добавить в базу индексацию по умолчанию - true при добавлении контракта
function getInflationIndexesConsideringIndexing(periods: Period[], contractId: number): InflationIndex[] {
    const indexes = getInflationIndexesByPeriods(periods);
    const indexingSigns = getIndexingSigns(contractId);

    if (isEmpty(indexingSigns)) {
        return indexes;
    }

    let lastSignIndex = 0;
    indexes.forEach((index) => {
        const indexPeriod = Period.ofString(index.period);
        for (let j = lastSignIndex; j < indexingSigns.length + 1; j++) {
            if (j === indexingSigns.length || indexingSigns[j].period.isAfter(indexPeriod)) {
                if (!indexingSigns[j - 1].indexing) {
                    index.index = 1;
                }
                lastSignIndex = j;
                break;
            }
        }
    });

    console.log(indexes);
    return indexes;
}

/**
 * Метод расчета финансовых периодов по указанным периодам. Не сохраняет данные в базу.
 * @param periodFrom
 * @param periodTo
 * @param contractId
 * @param contractExtensions
 */
// оплата должна быть в месяце + 1
// в оплате и период и дата платежа. ввод периода опциональный. если не введен - берем дату - 1
// todo проверить стуацию когда доп соглаш закончилось и началось новое

// todo дата окончания у соглашения бывает редко. должна быть возможность делать бессрочное доп соглашение
export function calculateFinancePeriods(
    periodFrom: Period,
    periodTo: Period,
    contractId: number,
    contractExtensions?: FullContractExtension[],
): FinancePeriod[] {
    if (periodFrom.isAfter(periodTo)) {
        return [];
    }

    if (contractExtensions) {
        localContractExtensions = contractExtensions.map((value) => ({
            dateStart: value.startDate,
            dateEnd: value.endDate,
            paymentActualityDate: value.paymentActualityDate,
            rentPayment: value.payment,
        }));
    } else {
        const allContractExtensions = getContractExtensions(contractId);
        localContractExtensions.push(...allContractExtensions);
    }

    const periods = generatePeriodsArray(periodFrom, periodTo);
    inflationIndexes = getInflationIndexesConsideringIndexing(periods, contractId);
    const periodsPayments = getPeriodsPayments(periods, contractId);
    const periodsAdjustments = getPeriodsAdjustments(periods, contractId);
    const prevPeriodDebt = getMonthDebt(periodFrom.subMonths(1), contractId);
    let dept = prevPeriodDebt.orElse(0);

    periods.forEach((period) => {
        const accruals = calculateAccruals(period, contractId);
        const payments = periodsPayments.find((value) => value.period.isSamePeriod(period));
        const adjustment = periodsAdjustments.find((value) => value.period.isSamePeriod(period));
        const safePayments = payments ? payments.sum : 0;
        const safeAdjustment = adjustment ? adjustment.adjustment : 0;
        const totalAccruals = accruals + safeAdjustment;
        dept += (totalAccruals - safePayments);
        calculatedPeriods.push(
            {
                period,
                accruals: totalAccruals,
                payments: safePayments,
                debt: dept,
                adjustments: safeAdjustment,
            },
        );
    });

    const tempCalculatedPeriods = calculatedPeriods;
    calculatedPeriods = [];
    localContractExtensions = [];
    inflationIndexes = [];

    return tempCalculatedPeriods;
}
