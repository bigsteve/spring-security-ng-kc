import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { HttpResponse } from '@angular/common/http';
import { DataPage } from '../../model/data.page.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';


@Component({
    selector: 'export-buttons',
    templateUrl: './export-buttons.component.html',
    styleUrls: ['./export-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonsComponent implements OnInit {
    @Input() observable: Observable<HttpResponse<DataPage>>
    @Input() filename: string
    private ngUnsubscribe: Subject<void> = new Subject<void>()

    ngOnInit(): void {
    }

    exportToExcel(): void {

        try {
            this.observable.pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    next: (response) => {

                        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(<any>response.body);
                        const wb: XLSX.WorkBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                        XLSX.writeFile(wb, this.filename + '.xlsx');
                    },
                    error: (error: any) => {
                        console.error('Error: ', error.message)
                    },
                    complete: () => {
                    }
                }
                )
        } catch (err) {
            console.error('Xlsx export error: ', err);
        }
    }

    exportToCSV(): void {

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
            filename: this.filename
        };
        try {
            const csvExporter = new ExportToCsv(options);
            this.observable.pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    next: (response) => {
                        csvExporter.generateCsv(<any>response.body)
                    },
                    error: (error: any) => {
                        console.error('Error: ', error.message)
                    },
                    complete: () => {
                    }
                }
                )

        } catch (err) {
            console.error('Csv export error: ', err);
        }
    }
}