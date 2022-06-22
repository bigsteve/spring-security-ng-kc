import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExportToCsv } from 'export-to-csv';
import { HttpResponse } from '@angular/common/http';
import { Page } from 'ngx-pagination/dist/pagination-controls.directive';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';


@Component({
    selector: 'export-buttons',
    templateUrl: './export-buttons.component.html',
    styleUrls: ['./export-buttons.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonsComponent implements OnInit {
    @Input() observable: Observable<HttpResponse<Page>>
    @Input() filename: string
    public configuration: Config;
    private ngUnsubscribe: Subject<void> = new Subject<void>()

    ngOnInit(): void {
        this.configuration = { ...DefaultConfig };
    }

    exportToExcel(): void {
        
        try {
            this.observable.pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    (response) => {
                        
                        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(<any>response.body["content"]);
                        const wb: XLSX.WorkBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                        XLSX.writeFile(wb, this.filename+'.xlsx');
                    },
                    (error: any) => {
                        console.error('ERROR: ', error.message)
                    }
                )
        } catch (err) {
            console.error('Xlsx export error', err);
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
            .subscribe(
                (response) => {
                    csvExporter.generateCsv(<any>response.body["content"])
                },
                (error: any) => {
                    console.error('ERROR: ', error.message)
                }
            )
            
        } catch (err) {
            console.error('Csv export error', err);
        }
    }
}