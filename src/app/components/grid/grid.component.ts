import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { DashService } from '../../services/dashboard/dash.service'
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'
import { User } from 'src/app/model/user.model'
import { Page } from 'src/app/model/page.model'

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
export class GridComponent implements OnInit, OnDestroy {
    @ViewChild('table', { static: true }) table: APIDefinition
    public columns: Columns[] = [
        { key: 'accountNumber', title: 'Account Number', searchEnabled: false },
        { key: 'closingBalance', title: 'Closing Balance', placeholder: 'Balance Bigger' },
        { key: 'createDt', title: 'Date', placeholder: 'Date After' },
        { key: 'transactionAmt', title: 'Amount', placeholder: 'Amount Bigger' },
        { key: 'transactionSummary', title: 'Summary' }
    ]
    private page: Page
    private params: string = '?limit=50'
    private user: User
    public data: {}
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
    
    private typeTimeouts = []
    private ngUnsubscribe: Subject<void> = new Subject<void>()

    constructor(
        private readonly companyService: DashboardService,
        private readonly cdr: ChangeDetectorRef
    ) {

        this.user = JSON.parse(sessionStorage.getItem('userdetails'))
    }

    ngOnInit(): void {
        this.configuration = { ...DefaultConfig }
        this.getData(this.params)
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.complete()
    }

    eventEmitted($event: { event: string, value: any }): void {
        if ($event.event !== 'onClick' && $event.event !== 'onSearch') {
            this.parseEvent($event)
        }
        

        const parse = () => {
            this.typeTimeouts = []
            this.parseEvent($event)
        }
        
        if ($event.event == 'onSearch') {
            
            this.typeTimeouts.push(setTimeout(parse, 600))

            while(this.typeTimeouts.length > 1) {

                clearTimeout(this.typeTimeouts[0])
                this.typeTimeouts.shift()
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
        }
        this.params = '?'

        Object.keys(this.pagination).forEach(el => {
            let v = this.pagination[el]
            if(el === "offset") v -= (v > 0) ? 1 : 0
            this.params += (el + "=" + v + "&")
        })
        
        this.getData(this.params)
    }

    private getData(params: string): void {
        
        console.log(params)
        this.configuration.isLoading = true
        this.configuration.searchEnabled = true
        this.configuration.exportEnabled = true
        this.configuration.serverPagination = true
        this.configuration.rows=50
        this.companyService
            .getAccountTransactions(params, this.user)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (response) => {
                    this.page = <any>response.body
                    this.data = this.page.content
                    console.log(this.page)
                    // ensure this.pagination.count is set only once and contains count of the whole array, not just paginated one
                    this.pagination.count =
                             response
                                ? this.page.totalElements
                                : 0
                    this.pagination = { ...this.pagination }
                    this.configuration.isLoading = false
                    this.cdr.detectChanges()
                    this.setPagRange()
                },
                (error) => {
                    console.error('ERROR: ', error.message)
                }
            )
    }

    private setRowStyle(): void {
        this.table.apiEvent({
            type: API.setRowStyle,
            value: { row: 1, attr: 'background', value: '#fd5e5ed4' }
        })
    }
    private setPagRange(): void {
        this.table.apiEvent({
            type: API.setPaginationRange,
            value: [50, 100, 250, 500]
        })
    }




}

