import * as Excel from 'exceljs';

export abstract class ReportService {
    static setMeta(workbook: Excel.Workbook) {
        workbook.creator = 'Arenda';
        workbook.lastModifiedBy = 'Arenda';
        workbook.created = new Date();
        workbook.modified = new Date();
    }

    protected readonly workbook: Excel.Workbook;
    protected readonly sheet: Excel.Worksheet;

    protected constructor(sheetName: string) {
        this.workbook = new Excel.Workbook();
        this.sheet = this.workbook.addWorksheet(sheetName);
        ReportService.setMeta(this.workbook);
    }

    abstract async create(data: any[], meta: ReportMeta): Promise<Report>;
}

export interface Report {
    name: string;
}

export interface ReportMeta {
    date: Date;
}

export interface TableColumn {
    name: string;
    index: number;
    width: number;
    contentHorizontalAlignment?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
}
