export interface MenuItem {
    text: string;
    action: string;
}

export interface InputItem {
    text: string;
    value: any;
}

export interface Pagination {
    page: number;
    size: number;
    sort: Array<string | null>;
    desc: Array<boolean | null>;
}

export interface Page<T> {
    content: T[];
    totalItems: number;
    totalPages: number;
}
