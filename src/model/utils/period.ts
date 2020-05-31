import {
    formatDateToDefaultFormat,
    formatDateToFriendly,
    formatDateToMonthString,
    formatMonthToFriendly,
    parseMonth,
} from '@/utils/date-utils';
import {
    addMonths,
    endOfMonth,
    getDaysInMonth,
    isAfter,
    isBefore,
    isSameMonth,
    startOfMonth,
    subMonths,
} from 'date-fns';

export default class Period {
    static ofDate(date: Date): Period {
        return new Period(date);
    }

    static ofString(value: string): Period {
        return new Period(parseMonth(value));
    }

    static ofMonthYear(month: number, year: number): Period {
        return new Period(new Date(year, month - 1));
    }

    static currentPeriod(): Period {
        return new Period(new Date());
    }

    static currentCalculativePeriod(): Period {
        return new Period(subMonths(new Date(), 1));
    }

    private readonly date!: Date;

    private constructor(date: Date) {
        this.date = startOfMonth(date);
    }

    public toDefaultFormat(): string {
        return formatDateToMonthString(this.date);
    }

    public toFriendlyFormat(): string {
        return formatMonthToFriendly(this.date);
    }

    public toDateFormat(): string {
        return formatDateToDefaultFormat(this.date);
    }

    public getDate(): Date {
        return this.date;
    }

    public startOfMonth(): Date {
        return this.date;
    }

    public endOfMonth(): Date {
        return endOfMonth(this.date);
    }

    public getDaysInMonth(): number {
        return getDaysInMonth(this.date);
    }

    public isSamePeriod(period: Period): boolean {
        // todo: проверить если месяц тот же а год разный
        return isSameMonth(this.date, period.getDate());
    }

    public isSamePeriodByDate(date: Date): boolean {
        // todo: проверить если месяц тот же а год разный
        return isSameMonth(this.date, date);
    }

    public isAfter(period: Period): boolean {
        return isAfter(this.date, period.getDate());
    }

    public isBefore(period: Period): boolean {
        return isBefore(this.date, period.getDate());
    }

    public addMonths(amount: number): Period {
        return Period.ofDate(addMonths(this.date, amount));
    }

    public subMonths(amount: number): Period {
        return Period.ofDate(subMonths(this.date, amount));
    }
}

Date.prototype.toString = function() {
    return formatDateToFriendly(this);
};

export function toSqlArray(array: Period[]): string {
    return `(${array.map((value) => `'${value.toDateFormat()}'`).join(', ')})`;
}

export function isSamePeriods(date1: Date, date2: Date) {
    return Period.ofDate(date1).isSamePeriod(Period.ofDate(date2));
}
