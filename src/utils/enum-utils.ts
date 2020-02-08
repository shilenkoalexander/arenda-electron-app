import { ComboBoxItem } from '@/types/common';
import { $enum } from 'ts-enum-util';

export function enumToComboBoxItems(e: { [s: number]: string }, mapper: (e: any) => string): ComboBoxItem[] {
    const items: ComboBoxItem[] = [];
    const values = $enum(e).getValues();
    values.forEach((value) => items.push(
        {
            text: mapper(value),
            value,
        },
    ));

    return items;
}
