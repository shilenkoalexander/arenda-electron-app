import { Contract } from '@/types/contracts';
import db from 'better-sqlite3-helper';

export function getAllContracts(): Contract[] {
    console.log('aga ' + db().name);
    const contracts = db().query('select * from contracts');
    console.log(contracts);
    return contracts.map((value) => ({
        id: value.id,
        number: value.id,
        startDate: value.startDate,
        endDate: value.endDate,
        tenantInfo: null,
        status: null,
    }));
}
