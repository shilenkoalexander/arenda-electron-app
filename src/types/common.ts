export interface IconParams {
    icon: string;
    color: string;
}

export interface MenuItem {
    text: string;
    action: string;
}

export interface ComboBoxItem {
    text: string;
    value: any;
}

export interface Pagination {
    page: number;
    size: number;
    sort: Array<string | null>;
    desc: boolean[];
}

export interface Page<T> {
    content: T[];
    totalItems: number;
    totalPages: number;
}
