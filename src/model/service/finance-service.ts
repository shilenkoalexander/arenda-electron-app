import {
    deleteContractExtension,
    getFinancePeriod,
    getIndexingSigns,
    insertIndexingSign,
    removeIndexingSign,
    replaceContractExtensions,
    replaceFinancePeriods,
    saveContractExtension,
    savePayment,
    updateFinancePeriod,
    updateIndexingSign,
} from '@/model/repository/finance-repository';
import Period from '@/model/utils/period';
import { FinancePeriod, Payment } from '@/model/types/finance-types';
import { EditableContractExtension, FullContractExtension } from '@/model/types/contract-types';
import { executeInTransaction } from '@/model/repository/repository';
import { isEmpty } from '@/model/utils/other-util';

export function saveNewAdjustment(contractId: number, sum: number, period: Period) {
    const financePeriod = getFinancePeriod(period, contractId)
        .orElseThrowWithMessage(
            `Ошибка при сохранении корректировки. Данный период (${period.toFriendlyFormat()}) еще не рассчитан.`,
        );

    financePeriod.accruals = financePeriod.accruals - financePeriod.adjustments + sum;
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

export function saveRecalculatedData(
    contractId: number,
    periods: FinancePeriod[],
    contractExtensions: EditableContractExtension[],
    deletedExtensionsId: number[],
) {
    executeInTransaction(() => {
        replaceFinancePeriods(contractId, periods);
        replaceContractExtensions(contractId, contractExtensions);
        deletedExtensionsId.forEach((value) => deleteContractExtension(value));
    });
}

export function inverseIndexingSign(contractId: number) {
    const lastIndexingSign = getIndexingSigns(contractId, true);

    if (isEmpty(lastIndexingSign)) {
        throw new Error(`Признаки индексации для id_contract = ${contractId} отсутствуют в базе.`
            + `Проверьте целостность данных`);
    }

    const currentPeriod = Period.currentPeriod();
    const newIndexingValue = !lastIndexingSign[0].indexing;

    if (lastIndexingSign[0].period.isSamePeriod(currentPeriod)) {
        if (lastIndexingSign.length > 1) {
            removeIndexingSign(lastIndexingSign[0].id);
            return;
        }

        updateIndexingSign(lastIndexingSign[0].id, newIndexingValue);
        return;
    }

    insertIndexingSign(contractId, currentPeriod, newIndexingValue);
}
