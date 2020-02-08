import { ContractStatus } from '@/types/contracts';
import { $enum } from 'ts-enum-util';

export function getIconColorByStatus(status: ContractStatus): string {
    return $enum.mapValue(status).with({
        [ContractStatus.ACTIVE]: '#41a145',
        [ContractStatus.EXTENDED]: '#28652c',
        [ContractStatus.PAUSED]: '#fbc228',
        [ContractStatus.CLOSED]: '#d42b2b',
        [ContractStatus.UNKNOWN]: '#9E9E9E',
    });
}

export function getIconByStatus(status: ContractStatus): string {
    return $enum.mapValue(status).with({
        [ContractStatus.ACTIVE]: 'mdi-checkbox-marked-circle-outline',
        [ContractStatus.EXTENDED]: 'mdi-progress-check',
        [ContractStatus.PAUSED]: 'mdi-clock-alert-outline',
        [ContractStatus.CLOSED]: 'mdi-close-circle-outline',
        [ContractStatus.UNKNOWN]: 'mdi-help-circle-outline',
    });
}
