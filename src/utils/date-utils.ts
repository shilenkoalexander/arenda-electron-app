import { format } from 'date-fns';

export function formatToFriendly(date: Date): string {
    return format(date, 'dd.MM.yyyy');
}
