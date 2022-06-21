import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'
import { User } from 'src/app/model/user.model'
import { Page } from 'src/app/model/page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'

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
    providers: [DashboardService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GridComponent implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild('table', { static: true }) table: APIDefinition
    @ViewChild('paginator', { static: true }) paginator: MatPaginator
    @ViewChild('cellPipingTransaction', { static: true }) cellPipingTransaction: TemplateRef<any>;
    @ViewChild('cellPipingBalance', { static: true }) cellPipingBalance: TemplateRef<any>;
    @ViewChild('cellPipingDate', { static: true }) cellPipingDate: TemplateRef<any>;

    public pageable: Pageable = new Pageable()
    public page: Page = new Page()
    private params: string = '?limit=50&offset=0'
    private user: User
    public configuration: Config

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
    public columns: Columns[]
    public test = "closingBalance"
    constructor(
        private readonly service: DashboardService,
        private readonly cdr: ChangeDetectorRef
    ) {

        this.user = JSON.parse(sessionStorage.getItem('userdetails'))
    }

    ngOnInit(): void {

        this.configuration = { ...DefaultConfig }
        this.getData(this.params)

        this.columns = [
            { key: 'accountNumber', title: 'Account Number', searchEnabled: false },
            { key: 'transactionId', title: 'Transaction Id', placeholder: 'Transaction Id' },
            { key: 'transactionType', title: 'Transaction Type', placeholder: 'Transaction Type' },
            { key: 'closingBalance', title: 'Closing Balance', placeholder: 'Balance Bigger', cellTemplate: this.cellPipingBalance },
            { key: 'createDt', title: 'Date', placeholder: 'Date', cellTemplate: this.cellPipingDate },
            { key: 'status', title: 'Status', placeholder: 'Status' },
            { key: 'transactionAmt', title: 'Amount', placeholder: 'Amount Bigger', cellTemplate: this.cellPipingTransaction },
            { key: 'transactionSummary', title: 'Summary' }
        ]

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
            .getAccountTransactions(paramsExport, this.user)
            .pipe(takeUntil(this.ngUnsubscribe))
    }


    eventEmitted($event: { event: string, value: any }): void {

        $event = this.convertPaginatorEvent($event)

        if ($event.event !== 'onClick' && $event.event !== 'onSearch') {
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
            this.paginator.firstPage()
        }

        this.pagination.offset -= (this.pagination.offset > 0) ? 1 : 0
        this.params = "?" + Object.keys(this.pagination).map(key => `${key}=${this.pagination[key]}`).join('&');

        this.getData(this.params)
    }

    private getData(params: string): void {

        console.log(params)
        this.configuration.isLoading = true
        this.configuration.searchEnabled = true
        this.configuration.exportEnabled = true
        this.configuration.serverPagination = true
        this.configuration.paginationEnabled = false
        this.configuration.rows = 50
        this.service
            .getAccountTransactions(params, this.user)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (response) => {
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
                (error: any) => {
                    console.error('ERROR: ', error.message)
                }
            )
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

    convertPaginatorEvent($event: any): any {
        if (!$event.hasOwnProperty("event") && $event.hasOwnProperty("pageSize") && $event.hasOwnProperty("pageIndex")) {
            const ev = {
                event: "onMatPagination",
                value: {
                    limit: $event.pageSize,
                    page: $event.pageIndex + 1
                }
            }
            $event = ev
        }
        return $event
    }

}

