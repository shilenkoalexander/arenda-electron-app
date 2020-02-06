import { $enum } from 'ts-enum-util';

export enum ContractStatus {
    ACTIVE,
    EXTENDED,
    PAUSED,
    CLOSED,
    UNKNOWN,
}

export function getContractStatusValue(status: ContractStatus): string {
    return $enum.mapValue(status).with({
        [ContractStatus.ACTIVE]: 'Действующий',
        [ContractStatus.EXTENDED]: 'Продлен',
        [ContractStatus.PAUSED]: 'Приостановлен',
        [ContractStatus.CLOSED]: 'Закрыт',
        [ContractStatus.UNKNOWN]: 'Неизвестный',
    });
}
