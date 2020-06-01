import { Report, ReportMeta, ReportService, TableColumn } from '@/model/report/report';
import fs from 'fs';
import path from 'path';
import { formatDateToFriendly } from '@/utils/date-utils';
import { EXCEL_HEIGHT_FACTOR, EXCEL_WIDTH_FACTOR, TABLE_HEADER_ALIGNMENT } from '@/model/utils/report-util';

interface AccrualsByDateReportDto {
    contractNumber: string;
    tenant: string;
    startDate: string;
    endDate: string;
    square: string;
    monthlyAccruals: string;
    prevMonthPayments: string;
    debtIncludingAccruals: string;
    adjustment: string;
    debtWithoutAccruals: string;
}

class TotalRow {
    square = 0;
    monthlyAccruals = 0;
    prevMonthPayments = 0;
    debtIncludingAccruals = 0;
    adjustment = 0;
    debtWithoutAccruals = 0;

    add(row: AccrualsByDateReportDto) {
        this.square += Number.parseFloat(row.square) || 0;
        this.monthlyAccruals += Number.parseFloat(row.monthlyAccruals) || 0;
        this.prevMonthPayments += Number.parseFloat(row.prevMonthPayments) || 0;
        this.debtIncludingAccruals += Number.parseFloat(row.debtIncludingAccruals) || 0;
        this.adjustment += Number.parseFloat(row.adjustment) || 0;
        this.debtWithoutAccruals += Number.parseFloat(row.debtWithoutAccruals) || 0;
    }
}

// todo да простит меня single responsibility. после диплома переделать обязательно
export class AccrualsByDateReport extends ReportService {
    private readonly tableHeaderRowIndex = 4;
    private readonly headers: TableColumn[] = [
        { name: '№ п/п', index: 2, width: 1.09, contentHorizontalAlignment: 'center' },
        { name: '№ договора', index: 3, width: 2.18, contentHorizontalAlignment: 'center' },
        { name: 'Арендатор', index: 4, width: 17.04 },
        { name: 'Дата заключения договора', index: 5, width: 2.93, contentHorizontalAlignment: 'center' },
        { name: 'Дата расторжения договора', index: 6, width: 3.32, contentHorizontalAlignment: 'center' },
        { name: 'Площадь, кв.м.', index: 7, width: 2.93, contentHorizontalAlignment: 'right' },
        { name: 'Начислено за месяц, росс.руб.', index: 8, width: 2.93, contentHorizontalAlignment: 'right' },
        { name: 'Поступило за предыдущий месяц', index: 9, width: 3.21, contentHorizontalAlignment: 'right' },
        { name: 'Задолженность с учетом начислений', index: 10, width: 3.73, contentHorizontalAlignment: 'right' },
        { name: 'Корректировка, росс.руб.', index: 11, width: 3.65, contentHorizontalAlignment: 'right' },
        { name: 'Задолженность без учета начислений', index: 12, width: 3.84, contentHorizontalAlignment: 'right' },
    ];

    constructor() {
        super('Отчет');
    }

    async create(data: AccrualsByDateReportDto[], meta: ReportMeta): Promise<Report> {
        this.setHeader(meta.date);
        this.setTableHeaders();
        this.setTableContent(data);

        const fileData = await this.workbook.xlsx.writeBuffer({
            filename: 'report',
        });
        fs.writeFileSync(path.join(__dirname + '../../../../../../../temp/report.xlsx'), fileData);

        return { name: 'govno' };
    }

    private printTableRow(orderNumber: number, rowIndex: number, rowData: AccrualsByDateReportDto) {
        let colIndex = 2;
        const row = this.sheet.getRow(rowIndex);
        let cell = row.getCell(colIndex++);
        cell.value = orderNumber;

        for (const colValue of Object.keys(rowData)) {
            cell = row.getCell(colIndex++);
            // @ts-ignore
            cell.value = rowData[colValue];
        }
    }

    private setTableContent(data: AccrualsByDateReportDto[]) {
        const totalRow = new TotalRow();
        data.forEach((value, index) => {
            totalRow.add(value);
            this.printTableRow(
                index + 1,
                this.tableHeaderRowIndex + index + 2,
                value,
            );
        });
        let colIndex = 7;

        for (const colValue of Object.keys(totalRow)) {
            const cell = this.sheet.getCell(this.tableHeaderRowIndex + 1, colIndex++);
            // @ts-ignore
            cell.value = totalRow[colValue].toFixed(2);
        }
    }

    private setTableHeaders() {
        this.headers.forEach((value) => {
            if (value.contentHorizontalAlignment) {
                this.sheet.getColumn(value.index).alignment = { horizontal: value.contentHorizontalAlignment };
            }

            const cell = this.sheet.getCell(this.tableHeaderRowIndex, value.index);
            cell.value = value.name;
            cell.style.alignment = TABLE_HEADER_ALIGNMENT;

            this.sheet.getColumn(value.index).width = value.width * EXCEL_WIDTH_FACTOR;
            this.sheet.getRow(this.tableHeaderRowIndex).height = 2.80 * EXCEL_HEIGHT_FACTOR;
        });
    }

    private setHeader(date: Date): void {
        this.sheet.getCell(2, 4).style.alignment = { vertical: 'middle', horizontal: 'center' };
        this.sheet.getCell(2, 4).value = `Ведомость начисления арендной платы за ${formatDateToFriendly(date)}`;
    }
}
