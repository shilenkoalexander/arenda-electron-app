import { Report, ReportService } from '@/model/report/report';
import fs from 'fs';
import path from 'path';

enum ColumnNames {
    ORDER_NUMBER,
    CONTRACT_NUMBER,
    TENANT_NAME,
    CONCLUSION_DATE,
    END_DATE,
    SQUARE,
    END_REASON,
    AREA,
    ADDRESS,
}

export class AllTenantsReportService extends ReportService {
    constructor() {
        super('Отчет');
    }

    async create(): Promise<Report> {

        const data = await this.workbook.xlsx.writeBuffer({
            filename: 'report',
        });

        fs.writeFileSync(path.join(__dirname + '../../../../../../../temp/report.xlsx'), data);

        return { name: 'govno' };
    }
}
