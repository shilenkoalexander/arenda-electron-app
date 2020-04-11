import db from 'better-sqlite3-helper';
import { InputItem } from '@/types/common';

export function getAreas(): InputItem[] {
    const result = db().query('select * from areas');

    return result.map((value) => ({
        text: value.name,
        value: value.id,
    } as InputItem));
}
