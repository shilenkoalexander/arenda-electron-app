import { FinancePeriod, IndexingSign, InflationIndex, Payment } from '@/model/types/finance-types';
import db from 'better-sqlite3-helper';
import { ResultMapperFactory } from '@/model/mapper/result-mapper-factory';
import { formatDateToDefaultFormat, parseDate } from '@/utils/date-utils';
import Optional from '@/model/utils/optional';
import Period, { toSqlArray } from '@/model/utils/period';
import { EditableContractExtension, FullContractExtension } from '@/model/types/contract-types';
import { executeInTransaction, findFirst, selectArray } from './repository';

export function getFinancePeriod(period: Period, contractId: number): Optional<FinancePeriod> {
    const result = findFirst(`
        select *
        from finance_card
        where period = '${period.toDateFormat()}' and id_contract = ${contractId}
    `);

    return result.map((value) => ResultMapperFactory.financePeriodMapper.map(value));
}

export function getAllPeriods(contractId: number): FinancePeriod[] {
    return selectArray(`
            select * from finance_card
            where id_contract = ${contractId}
            order by period desc
        `,
        ResultMapperFactory.financePeriodMapper,
    );
}

export function getMonthDebt(period: Period, contractId: number): Optional<number> {
    const result = findFirst(`
        select debt from finance_card
        where period = '${period.toDateFormat()}' and id_contract = ${contractId}
    `);

    return result.map((value) => value.debt);
}

export function getContractStartCalculationDate(contractId: number): Date {
    const result = findFirst(`
        select calculation_start_date from contracts
        where id = ${contractId}
    `);

    return result.map((value) => parseDate(value.calculation_start_date))
        .orElseThrowWithMessage(`Договор с ${contractId} отсутствует`);
}

export function getInflationIndexesByPeriods(periods: Period[], desc = false): InflationIndex[] {
    return selectArray(`
            select *
            from inflation_index
            where period in ${toSqlArray(periods)}
            order by period ${desc ? 'desc' : ''}
        `,
        ResultMapperFactory.inflationIndexMapper,
    );
}

export function insertFinancePeriod(contractId: number, card: FinancePeriod) {
    db().insert('finance_card', {
        id_contract: contractId,
        period: card.period,
        accruals: card.accruals.toFixed(2),
        adjustments: card.adjustments.toFixed(2),
        debt: card.debt.toFixed(2),
    });
}

// todo тип и маппер добавить
export function getPeriodsPayments(periods: Period[], contractId: number): Array<{ period: Period; sum: number }> {
    const result = db().query(`
        select period, sum(sum) as sum
        from payments
        where id_contract = ${contractId} and period in ${toSqlArray(periods)}
        group by period
    `);

    return result.map((value) => ({
        period: Period.ofString(value.period),
        sum: Number.parseFloat(value.sum),
    }));
}

export function getPeriodsAdjustments(
    periods: Period[],
    contractId: number,
): Array<{ period: Period; adjustment: number }> {
    const result = db().query(`
        select period, adjustments
        from finance_card
        where id_contract = ${contractId} and period in ${toSqlArray(periods)}
        group by period
    `);

    return result.map((value) => ({
        period: Period.ofString(value.period),
        adjustment: Number.parseFloat(value.adjustments),
    }));
}

export function updateFinancePeriod(contractId: number, financePeriod: FinancePeriod) {
    db().update(
        'finance_card',
        {
            adjustments: financePeriod.adjustments,
            accruals: financePeriod.accruals,
            debt: financePeriod.debt,
            payments: financePeriod.payments,
        },
        {
            id_contract: contractId,
            period: financePeriod.period.toDateFormat(),
        },
    );
}

export function replaceFinancePeriod(contractId: number, financePeriod: FinancePeriod) {
    db().replace('finance_card',
        {
            id_contract: contractId,
            period: financePeriod.period.toDateFormat(),
            adjustments: financePeriod.adjustments.toFixed(2),
            accruals: financePeriod.accruals.toFixed(2),
            debt: financePeriod.debt.toFixed(2),
            payments: financePeriod.payments.toFixed(2),
        },
    );
}

export function replaceFinancePeriods(contractId: number, financePeriod: FinancePeriod[]) {
    executeInTransaction(() => {
        financePeriod.forEach((value) => replaceFinancePeriod(contractId, value));
    });
}

export function replaceContractExtension(contractId: number, extension: EditableContractExtension) {
    const dbFormatExtension = {
        id_contract: contractId,
        start_date: formatDateToDefaultFormat(extension.startDate),
        to_date: formatDateToDefaultFormat(extension.endDate),
        conclusion_date: formatDateToDefaultFormat(extension.conclusionDate),
        payment: extension.payment.toFixed(2),
        payment_actuality_date: formatDateToDefaultFormat(extension.paymentActualityDate),
    };

    if (extension.isNew) {
        db().insert('contract_extensions', dbFormatExtension);
        return;
    }

    db().update('contract_extensions', dbFormatExtension, {
        id: extension.id,
    });
}

export function replaceContractExtensions(contractId: number, extensions: EditableContractExtension[]) {
    executeInTransaction(() => {
        extensions.forEach((value) => replaceContractExtension(contractId, value));
    });
}

export function removeIndexingSign(id: number) {
    db().exec(`delete from indexing where id = ${id}`);
}

export function updateIndexingSign(id: number, newIndexingValue: boolean) {
    db().update('indexing', {
            indexing: newIndexingValue,
        },
        {
            id,
        });
}

export function insertIndexingSign(contractId: number, period: Period, indexing: boolean) {
    db().insert(
        'indexing',
        {
            id_contract: contractId.toFixed(2),
            period: period.toDateFormat(),
            indexing: indexing ? 1 : 0,
        },
    );
}

export function deleteContractExtension(id: number) {
    db().exec(`delete from contract_extensions where id = ${id}`);
}

export function savePayment(contractId: number, payment: Payment) {
    db().insert('payments', {
        id_contract: contractId,
        date: formatDateToDefaultFormat(payment.date),
        period: payment.period.toDateFormat(),
        sum: payment.sum,
    });
}

export function getPayments(contractId: number): Payment[] {
    return selectArray(`
            select sum, period, date from payments
            where id_contract = ${contractId}
            order by period desc, date desc, id desc
        `,
        ResultMapperFactory.paymentMapper,
    );
}

export function getIndexingSigns(contractId: number, desc = false): IndexingSign[] {
    return selectArray(`
            select * from indexing
            where id_contract = ${contractId}
            order by period ${desc ? 'desc' : ''}
        `,
        ResultMapperFactory.indexingSignMapper,
    );
}

export function saveContractExtension(contractId: number, contractExtension: FullContractExtension) {
    db().insert('contract_extensions', {
        id_contract: contractId,
        start_date: formatDateToDefaultFormat(contractExtension.startDate),
        to_date: formatDateToDefaultFormat(contractExtension.endDate),
        conclusion_date: formatDateToDefaultFormat(contractExtension.conclusionDate),
        payment_actuality_date: formatDateToDefaultFormat(contractExtension.paymentActualityDate),
        payment: contractExtension.payment.toFixed(2),
    });
}
