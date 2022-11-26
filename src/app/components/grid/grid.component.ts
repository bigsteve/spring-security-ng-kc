import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    isDevMode
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DataPage } from 'src/app/model/data.page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip'
import { Utils } from 'src/app/utils/utils.model'
import { Filter } from 'src/app/model/search/filter.model'

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Filter]
})

/**
 * 
 */
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('paginator', { static: true }) paginator: MatPaginator
    @ViewChild('pipeCurrency', { static: true }) pipeCurrency: TemplateRef<any>
    @ViewChild('pipeDateShort', { static: true }) public pipeDateShort: TemplateRef<any>
    @ViewChild('pipeDateShortThTemplate', { static: true }) public pipeDateShortThTemplate: TemplateRef<any>
    @ViewChild('rowActions', { static: true }) public rowActions: TemplateRef<any>

    @Input() crudConfig: any
    @Input() seo: Seo
    @Input() service: any
    @Input() columns: any


    public displayedColumns: object
    public actionColumns: string[] = []
    public hiddenColumns: string[] = []
    public sensitiveColumns: string[] = []
    public page: DataPage = new DataPage()
    // public search: Search = new Search()
    public exportFileName: string
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()
    private positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    public toolTipPosition = new FormControl(this.positionOptions[1])

    constructor(
        private readonly cdr: ChangeDetectorRef,
        public filter: Filter
    ) { }

    displayedColumnsArray(v: object) {
        return Object.keys(v).concat(this.actionColumns)
    }

    testCols() {
        delete this.displayedColumns[Object.keys(this.displayedColumns).pop()]
        // this.displayedColumns['transactionSummary'] = ''
        // this.filter.initialize(this.crudConfig.crudName + '_filter', this.displayedColumns, [])
        console.log(this.filter)
        console.log(this.filter.getFromLocalStorage())
    }

    ngOnInit(): void {

        this.displayedColumns = this.columns.filter(el => !this.hiddenColumns.includes(el.key)).filter(el => {
            el.sensitiveData && this.sensitiveColumns.push(el.key)
            if (el.cellTemplate.includes('Actions')) {
                this.actionColumns.push(el.key)
                return false
            }
            return true
        }).map(el => el.key).reduce((a, v) => ({ ...a, [v]: '' }), {})

        // delete this.displayedColumns['transactionSummary']
        // this.displayedColumns = {accountNumber:'', transactionId: '', createDt:''}

        this.filter.search = this.displayedColumns
        this.filter.doNotStore = this.sensitiveColumns
        this.filter.storageName = this.crudConfig.crudName + '_filter'


        // this.filter.initialize(this.crudConfig.crudName + '_filter', this.displayedColumns, this.sensitiveColumns)

        const d = new Date()
        this.exportFileName = Utils.strReplaceAll(' ', '-', this.seo.title).toLowerCase() + "-" + d.getFullYear() + "-" + Utils.zeroPrefix(d.getMonth()) + "-" + Utils.zeroPrefix(d.getDate()) + "-" + Utils.zeroPrefix(d.getHours())
        this.getData(this.filter.getParameterAndEncodedValue())
        this.filter.onFilterChange.subscribe(event => this.translateEventFilter(event))

    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.complete()
    }


    ngAfterViewInit() {
    }


    ngAfterViewChecked() {

    }


    exportData() {
        // TODO: set correct limit and offset parameters or better remove them
        let filterNewObj = JSON.parse(this.filter.getJson())
        filterNewObj.limit = this.page.totalElements
        filterNewObj.offset = 0
        let paramsExport = '?export=true&params=' + new URLSearchParams(JSON.stringify(filterNewObj)).toString()
        return this.service
            .getData(paramsExport)
            .pipe(takeUntil(this.ngUnsubscribe))
    }





    private parseEvent(): void {
        this.getData(this.filter.getParameterAndEncodedValue())
    }



    private getData(params: string): void {


        this.service
            .getData(params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    this.page = <any>response.body.message
                    if (isDevMode()) console.log(this.page)
                    this.page.pageable = new Pageable(this.page.pageable)

                },
                error: (error: any) => {
                    console.error('Error: ', error.message)
                },
                complete: () => {
                    this.cdr.detectChanges()
                }
            })
    }



    translateEventRowClick($event: any) {
        if (isDevMode()) console.log($event)
    }



    translateEventFilter($event: any) {

        if (isDevMode()) console.log($event)
        const timeoutParseEvent = () => {

            this.timeouts[$event.event] = []
            this.parseEvent()
        }

        if (!this.timeouts.hasOwnProperty($event.event)) this.timeouts[$event.event] = []
        this.timeouts[$event.event].push(setTimeout(timeoutParseEvent, 500))

        while (this.timeouts[$event.event].length > 1) {
            clearTimeout(this.timeouts[$event.event][0])
            this.timeouts[$event.event].shift()
        }
    }



}
