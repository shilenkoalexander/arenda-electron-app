import { FinancePeriod } from '@/types/finance';
import db from 'better-sqlite3-helper';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper';
import { formatDateStringToMonthString } from '@/utils/date-utils';

export function getFinancePeriod(month: string, contractId: number): FinancePeriod {
    let period = month;

    if (!period) {
        const res = db().queryFirstRow(
            `select max(period) as period
                 from finance_card
                 where id_contract = ${contractId}`,
        ) as any;
        period = res.period;
    }

    const result = db().queryFirstRow(`
        select *
        from finance_card
        where period = '${period}' and id_contract = ${contractId}`);

    return ResultMapperFactory.financialPeriodMapper.map(result);
}

export function getAllPeriods(contractId: number): FinancePeriod[] {
    const result = db().query(`
        select * from finance_card
        where id_contract = ${contractId}
        order by period desc
    `);

    return result.map(ResultMapperFactory.financialPeriodMapper.map);
}

export function getAvailablePeriods(contractId: number): string[] {
    const result = db().query(`
        select period from finance_card
        where id_contract = ${contractId}
        group by period
    `);

    return result.map((value) => formatDateStringToMonthString(value.period));
}

export function isCalculated(period: string, contractId: number): boolean {
    const result = db().query(`
        select * from finance_card
        where period = '${period}' AND id_contract = ${contractId}
    `);

    return result.length > 0;
}

export function getFinanceActionsSum(period: string, contractId: number): FinancePeriod {
    const result = db().queryFirstRow(`
        select accrual.period, accruals, adjustments, payments, 0
        from (
                 select period, sum(sum) as accruals
                 from finance_action
                          inner join finance_action_type fat on finance_action.id_action_type = fat.id
                 where period = ${period} and id_contract = ${contractId} and fat.name = 'ACCRUAL'
                 group by period
             ) as accrual
                 inner join (
            select period, sum(sum) as adjustments
            from finance_action
                     inner join finance_action_type fat on finance_action.id_action_type = fat.id
            where period = ${period} and id_contract = ${contractId} and fat.name = 'ADJUSTMENT'
            group by period
        ) as adjustment on accrual.period = adjustment.period
                 inner join (
            select period, sum(sum) as payments
            from finance_action
                     inner join finance_action_type fat on finance_action.id_action_type = fat.id
            where period = ${period} and id_contract = ${contractId} and fat.name = 'PAYMENT'
            group by period
        ) as payment on accrual.period = payment.period;
    `) as any;

    return ResultMapperFactory.financialPeriodMapper.map(result);
}

export function getMonthDebt(period: string, contractId: number): number {
    const result = db().queryFirstRow(`
        select debt from finance_card
        where period = '${period}' and id_contract = ${contractId}
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

export function insertFinancePeriod(contractId: number, card: FinancePeriod) {
    db().insert('finance_card', {
        id_contract: contractId,
        period: card.period,
        accruals: card.accruals.toFixed(2),
        adjustments: card.adjustments.toFixed(2),
        debt: card.debt.toFixed(2),
    });
}

