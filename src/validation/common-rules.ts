export function notEmptyRule(value: any): string | true {
    const errorMessage = 'Поле не должно быть пустым';
    if (typeof value === 'string') {
        return value && value.trim().length > 0 ? true : errorMessage;
    }
    return value ? true : errorMessage;
}