import { format, parse } from 'date-fns';

export function formatToFriendly(date: Date): string {
    return format(date, 'dd.MM.yyyy');
}

export function parseDate(date: string): Date {
    return parse(date, 'yyyy-MM-dd', new Date());
}

export function formatMonthToFriendly(date: Date): string {
    return format(date, 'MM.yyyy');
}
