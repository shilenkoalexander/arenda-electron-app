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
    desc: Array<boolean | null>;
}

export interface Page<T> {
    content: T[];
    totalItems: number;
    totalPages: number;
}

// это чтобы можно было нормально использовать ascii как ключ
export interface AssociativeArrayItem {
    key: string;
    value: string;
}
