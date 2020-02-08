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
    sort: string;
    direction: string;
}
