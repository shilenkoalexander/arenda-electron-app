import { format, parse } from 'date-fns';

export function parseDate(date: string): Date {
    return parse(date, 'yyyy-MM-dd', new Date());
}

export function formatToFriendly(date: string): string {
    return format(parseDate(date), 'dd.MM.yyyy');
}

export function formatMonthToFriendly(date: Date): string {
    return format(date, 'MM.yyyy');
}

export function formatToFriendlyByDate(date: Date): string {
    return format(date, 'dd.MM.yyyy');
}
