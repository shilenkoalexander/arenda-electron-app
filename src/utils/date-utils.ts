import { format, parse, startOfMonth } from 'date-fns';
import Period from '@/backend/utils/period';

export function parseDate(date: string): Date {
    return parse(date, 'yyyy-MM-dd', new Date());
}

export function formatToFriendly(date: string): string {
    return format(parseDate(date), 'dd.MM.yyyy');
}

export function formatDateToFriendly(date: Date): string {
    return format(date, 'dd.MM.yyyy');
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
    if (date.match(new RegExp('^\\d{4}-\\d{2}$'))) {
        return date + '-01';
    }

    if (date.match(new RegExp('^\\d{4}-\\d{2}-\\d{2}$'))) {
        return date;
    }
    throw new Error('Неправильный формат даты ' + date);
}

export function parseMonth(date: string): Date {
    return parseDate(formatMonthStringToStartMonthDateString(date));
}

export function generatePeriodsArray(periodFrom: Period, periodTo: Period): Period[] {
    if (periodFrom.isSamePeriod(periodTo)) {
        return [periodFrom];
    }

    if (periodFrom.isAfter(periodTo)) {
        return [];
    }

    const periods = [];
    let currentMonth = periodFrom;

    const endPeriod = periodTo.addMonths(1);
    do {
        periods.push(currentMonth);
        currentMonth = currentMonth.addMonths(1);
    } while (currentMonth.isBefore(endPeriod));

    return periods;
}

export function formatToPeriod(date: Date): string {
    return formatDateToDefaultFormat(startOfMonth(date));
}

export function toPeriodsArray(dates: Date[]): string[] {
    return dates.map((value) => formatToPeriod(value));
}
