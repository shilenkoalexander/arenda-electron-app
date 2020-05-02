import {
    getFinancePeriod,
    saveContractExtension,
    savePayment,
    updateFinancePeriod,
} from '@/backend/repository/finance-repository';
import Period from '@/backend/utils/period';
import { Payment } from '@/types/finance';
import { FullContractExtension } from '@/types/contracts';

export function saveNewAdjustment(contractId: number, sum: number, period: Period) {
    const financePeriod = getFinancePeriod(period, contractId)
        .orElseThrowWithMessage(
            `Ошибка при сохранении корректировки. Данный период (${period.toFriendlyFormat()}) еще не рассчитан.`,
        );

    financePeriod.accruals -= financePeriod.adjustments + sum;
    financePeriod.adjustments = sum;
    financePeriod.debt += sum;

    updateFinancePeriod(contractId, financePeriod);
}

export function addPayment(contractId: number, payment: Payment) {
    savePayment(contractId, payment);

    const financePeriod = getFinancePeriod(payment.period, contractId)
        .orElseThrowWithMessage(`Период ${payment.period.toFriendlyFormat()} для договора ${contractId}`);

    financePeriod.payments += payment.sum;
    financePeriod.debt -= payment.sum;

    updateFinancePeriod(contractId, financePeriod);
}

export function addContractExtension(contractId: number, contractExtension: FullContractExtension) {
    saveContractExtension(contractId, contractExtension);
}
