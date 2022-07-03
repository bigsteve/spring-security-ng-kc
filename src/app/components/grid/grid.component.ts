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
} from '@angular/core'
import { API, APIDefinition, Config, DefaultConfig } from 'ngx-easy-table'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Page } from 'src/app/model/page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'

interface EventObject {
    event: string
    value: {
        limit: number
        page: number
        key: string
        order: string
        value: string
    }
}

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/*
    TODO:
    remove ngx-table completly (add list, filters and ordering)
    actions template
    refine parameters to include columns and use multiple filters
    FIX:
    date pipe/filering doesn't work correclty for month february (02) becuse it is substracting 1 day from dd group when day is < 05
*/
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('table', { static: true }) table: APIDefinition
    @ViewChild('paginator', { static: true }) paginator: MatPaginator
    @ViewChild('pipeCurrency', { static: true }) pipeCurrency: TemplateRef<any>;
    @ViewChild('pipeDateShort', { static: true }) public pipeDateShort: TemplateRef<any>;
    @ViewChild('rowActions', { static: true }) public rowActions: TemplateRef<any>;
    @Input() seo: Seo = new Seo()
    @Input() service: any
    @Input() columns: any

    public pageable: Pageable = new Pageable()
    public page: Page = new Page()
    private params: string = '?limit=50&offset=0'
    public configuration: Config
    public exportFileName: string
    public pagination = {
        limit: 50,
        offset: 0,
        count: -1,
        orderby: "",
        orderdir: "",
        searchby: "",
        search: ""
    }

    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()

    constructor(
        private readonly cdr: ChangeDetectorRef
    ) {}

    zeroPrefix(n: number): string {
        return (n < 10) ? "0" + n : n.toString()
    }

    ngOnInit(): void {
        this.columns = this.columns

        this.columns.forEach(el => {
            if (el.hasOwnProperty("cellTemplate")) {
                el.cellTemplate = this[el.cellTemplate]
            }
        })


        const d = new Date()
        this.exportFileName = this.seo.title.replace(" ", "-").toLowerCase() + "-" + d.getFullYear() + "-" + this.zeroPrefix(d.getMonth()) + "-" + this.zeroPrefix(d.getDate()) + "-" + this.zeroPrefix(d.getHours())
        this.configuration = { ...DefaultConfig }
        this.getData(this.params)
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.complete()
    }

    ngAfterViewInit() {
    }


    exportData() {
        let paramsExport = "?limit=" + this.pagination.count + "&" + Object.keys(this.pagination)
            .filter(k => (k != "limit" && k != "offset" && k != "count"))
            .map(key => `${key}=${this.pagination[key]}`).join('&')

        return this.service
            .getData(paramsExport)
            .pipe(takeUntil(this.ngUnsubscribe))
    }


    eventEmitted($event: { event: string, value: any }): void {

        $event = this.convertPaginatorEvent($event)

        if ($event.event !== 'onClick' && $event.event !== 'onSearch' && $event.event !== 'onDoubleClick') {
            this.parseEvent($event)
        }



        const timeoutParseEvent = () => {
            this.timeouts[$event.event] = []
            this.parseEvent($event)
        }



        if ($event.event == 'onSearch') {

            if (!this.timeouts.hasOwnProperty($event.event)) this.timeouts[$event.event] = []
            this.timeouts[$event.event].push(setTimeout(timeoutParseEvent, 600))

            while (this.timeouts[$event.event].length > 1) {

                clearTimeout(this.timeouts[$event.event][0])
                this.timeouts[$event.event].shift()
            }

        }
        console.log($event)
    }


    private parseEvent(obj: EventObject): void {

        this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit
        this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset

        if (obj.event === 'onOrder') {
            this.pagination.orderby = obj.value.key ? obj.value.key : this.pagination.orderby
            this.pagination.orderdir = obj.value.order ? obj.value.order : this.pagination.orderdir
        }

        if (obj.event === 'onSearch') {
            this.pagination.searchby = obj.value[0].key
            this.pagination.search = obj.value[0].value
            this.pagination.offset = 0
        }
        if (obj.event === 'onMatPagination') {
            this.pagination.offset = obj.value.page
        }

        this.params = "?" + Object.keys(this.pagination).map(key => `${key}=${this.pagination[key]}`).join('&');

        this.getData(this.params)
    }

    private getData(params: string): void {

        console.log(params)
        this.configuration.isLoading = true
        this.configuration.searchEnabled = true
        this.configuration.exportEnabled = true
        this.configuration.serverPagination = true
        this.configuration.paginationEnabled = true
        this.configuration.rows = 50
        this.service
            .getData(params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    this.page = <any>response.body
                    console.log(this.page)

                    this.pagination.limit = this.page.pageable.pageSize
                    this.pagination.offset = this.page.pageable.pageNumber
                    this.pagination.count = response ? this.page.totalElements : 0

                    this.pagination = { ...this.pagination }
                    this.configuration.isLoading = false
                    this.cdr.detectChanges()
                    this.customizeGrid()
                },
                error: (error: any) => {
                    console.error('Error: ', error.message)
                },
                complete: () => console.info('rxjs subscribe complete')
            })
    }

    private customizeGrid(): void {
        this.table.apiEvent({
            type: API.setPaginationRange,
            value: [50, 100, 250, 500]
        })

        if (false) {
            this.table.apiEvent({
                type: API.setRowStyle,
                value: { row: 1, attr: 'background', value: '#fd5e5ed4' }
            })
        }
        
    }

    debugVal(v: any): void {
        console.log(v)
    }

    convertPaginatorEvent($event: any): any {
        if (!$event.hasOwnProperty("event") && $event.hasOwnProperty("pageSize") && $event.hasOwnProperty("pageIndex")) {
            const ev = {
                event: "onMatPagination",
                value: {
                    limit: $event.pageSize,
                    page: $event.pageIndex
                }
            }
            $event = ev
            console.log($event)
        }
        return $event
    }

}

