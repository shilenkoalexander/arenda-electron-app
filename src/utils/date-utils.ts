import { addMonths, format, isAfter, isBefore, parse } from 'date-fns';

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

export function formatDateStringToMonthString(date: string): string {
    return format(parseDate(date), 'yyyy-MM');
}

export function formatDateToMonthString(date: Date): string {
    return format(date, 'yyyy-MM');
}

export function formatDateToDefaultFormat(date: Date) {
    return format(date, 'yyyy-MM-dd');
}

export function formatMonthStringToStartMonthDateString(date: string): string {
    if (date.match(new RegExp('\\d{4}-\\d{2}'))) {
        return date + '-01';
    }
    throw new Error('Неправильный формат даты ' + date);
}

export function parseMonth(date: string): Date {
    return parseDate(formatMonthStringToStartMonthDateString(date));
}

export function generatePeriodsArray(periodFrom: Date, periodTo: Date): Date[] {
    if (isAfter(periodFrom, periodTo)) {
        return [];
    }

    const periods = [];
    let currentMonth = periodFrom;

    do {
        periods.push(currentMonth);
        currentMonth = addMonths(currentMonth, 1);
    } while (isBefore(currentMonth, addMonths(periodTo, 1)));

    return periods;
}
