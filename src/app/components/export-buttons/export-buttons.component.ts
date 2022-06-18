import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExportToCsv } from 'export-to-csv';
import { HttpResponse } from '@angular/common/http';
import { Page } from 'ngx-pagination/dist/pagination-controls.directive';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'export-buttons',
    templateUrl: './export-buttons.component.html',
    styleUrls: ['./export-buttons.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonsComponent implements OnInit {
    @Input()  columns: Columns[]
    @Input()  observable: Observable<HttpResponse<Page>>
    @Output() exportEmitter = new EventEmitter()
    public configuration: Config;
    private ngUnsubscribe: Subject<void> = new Subject<void>()

    ngOnInit(): void {
        this.configuration = { ...DefaultConfig };
    }

    exportToExcel(): void {
        // Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
        // try {
        //   /* generate worksheet */
        //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
        //
        //   /* generate workbook and add the worksheet */
        //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        //
        //   /* save to file */
        //   XLSX.writeFile(wb, 'file.xlsx');
        // } catch (err) {
        //   console.error('export error', err);
        // }
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
        };
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
    }
}