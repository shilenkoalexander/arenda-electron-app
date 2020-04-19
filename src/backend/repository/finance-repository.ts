import { FinancePeriod, InflationIndex } from '@/types/finance';
import db from 'better-sqlite3-helper';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper';
import { formatDateStringToMonthString, formatToPeriod, toPeriodsArray } from '@/utils/date-utils';
import { toSqlArray } from '@/backend/utils/sql-util';
import Optional from '@/backend/utils/optional';

export function getLastFinancePeriod(period: Date | null, contractId: number): FinancePeriod {
    let stringPeriod = '';

    if (period) {
        stringPeriod = formatToPeriod(period);
    }

    if (!period) {
        const res = db().queryFirstRow(
            `select max(period) as period
                 from finance_card
                 where id_contract = ${contractId}`,
        ) as any;
        stringPeriod = res.period;
    }

    const result = db().queryFirstRow(`
        select *
        from finance_card
        where period = '${stringPeriod}' and id_contract = ${contractId}`);

    return ResultMapperFactory.financePeriodMapper.map(result);
}

export function getFinancePeriod(period: Date, contractId: number): Optional<FinancePeriod> {
    const result = db().queryFirstRow(`
        select *
        from finance_card
        where period = '${formatToPeriod(period)}' and id_contract = ${contractId}
    `);

    return Optional.of(result).map((value) => ResultMapperFactory.financePeriodMapper.map(value));
}

export function getAllPeriods(contractId: number): FinancePeriod[] {
    const result = db().query(`
        select * from finance_card
        where id_contract = ${contractId}
        order by period desc
    `);

    return result.map((value) => ResultMapperFactory.financePeriodMapper.map(value));
}

export function getAvailablePeriods(contractId: number): string[] {
    const result = db().query(`
        select period from finance_card
        where id_contract = ${contractId}
        group by period
    `);

    return result.map((value) => formatDateStringToMonthString(value.period));
}

export function isCalculated(period: Date, contractId: number): boolean {
    const result = db().query(`
        select * from finance_card
        where period = '${formatToPeriod(period)}' AND id_contract = ${contractId}
    `);

    return result.length > 0;
}

export function getFinanceActionsSum(period: Date, contractId: number): FinancePeriod {
    const periodString = formatToPeriod(period);

    const result = db().queryFirstRow(`
        select accrual.period, accruals, adjustments, payments, 0
        from (
                 select period, sum(sum) as accruals
                 from finance_action
                          inner join finance_action_type fat on finance_action.id_action_type = fat.id
                 where period = ${periodString} and id_contract = ${contractId} and fat.name = 'ACCRUAL'
                 group by period
             ) as accrual
                 inner join (
            select period, sum(sum) as adjustments
            from finance_action
                     inner join finance_action_type fat on finance_action.id_action_type = fat.id
            where period = ${periodString} and id_contract = ${contractId} and fat.name = 'ADJUSTMENT'
            group by period
        ) as adjustment on accrual.period = adjustment.period
                 inner join (
            select period, sum(sum) as payments
            from finance_action
                     inner join finance_action_type fat on finance_action.id_action_type = fat.id
            where period = ${periodString} and id_contract = ${contractId} and fat.name = 'PAYMENT'
            group by period
        ) as payment on accrual.period = payment.period;
    `) as any;

    return ResultMapperFactory.financePeriodMapper.map(result);
}

export function getMonthDebt(period: Date, contractId: number): number {
    const result = db().queryFirstRow(`
        select debt from finance_card
        where period = '${formatToPeriod(period)}' and id_contract = ${contractId}
    `) as any;

    return result ? result.debt as number : 0;
}

export function isNeverCalculated(contractId: number): boolean {
    const result = db().queryFirstRow(`
        select count(*) as count from finance_card
        where id_contract = ${contractId}
    `) as any;

    return result.count === 0;
}

export function getInflationIndexes(periods: Date[]): InflationIndex[] {
    const result = db().query(`
        select *
        from inflation_index
        where period in ${toSqlArray(toPeriodsArray(periods))}
    `);

    return result.map((value) => ResultMapperFactory.inflationIndexMapper.map(value));
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

