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
    isDevMode,
    HostListener
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DataPage } from 'src/app/model/data.page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { Search } from 'src/app/model/pageable/search.model'
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip'
import { Utils } from 'src/app/utils/utils.model'
import { ParametersString } from 'src/app/model/parameters.string.model'
import { Filter } from 'src/app/model/search/filter.model'

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * @desc GridComponent class
 * TODO:
 * refine parameters
 * refine parameters storage
 */
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {

    @HostListener('matSortChange', ['$event'])

    @ViewChild('paginator', { static: true }) paginator: MatPaginator
    @ViewChild('pipeCurrency', { static: true }) pipeCurrency: TemplateRef<any>;
    @ViewChild('pipeDateShort', { static: true }) public pipeDateShort: TemplateRef<any>;
    @ViewChild('pipeDateShortThTemplate', { static: true }) public pipeDateShortThTemplate: TemplateRef<any>;
    @ViewChild('rowActions', { static: true }) public rowActions: TemplateRef<any>;
    @ViewChild(MatSort) sort: MatSort;

    @Input() crudConfig: any
    @Input() seo: Seo
    @Input() service: any
    @Input() columns: any


    public displayedColumns: string[] = []
    public hiddenColumns: string[] = []
    public sensitiveColumns: string[] = []
    public page: DataPage = new DataPage()
    public search: Search = new Search()
    public exportFileName: string
    public filter: Filter
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()
    private positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    public toolTipPosition = new FormControl(this.positionOptions[1])
    private p: ParametersString
    public rowmodel = { transactionSummary: new URLSearchParams(localStorage.getItem('_myaccount_balance_balance_crud')).get("search") }




    constructor(
        private readonly cdr: ChangeDetectorRef
    ) { }


    ngOnInit(): void {
        this.displayedColumns = this.columns.filter(el => !this.hiddenColumns.includes(el.key)).filter(el => {
            if(el.sensitiveData) this.sensitiveColumns.push(el.key)
            return true
        }).map(el => el.key)
        
        this.filter = new Filter(this.crudConfig.crudName + '_filter', ['accountNumber']);
        const d = new Date()
        this.exportFileName = Utils.strReplaceAll(' ', '-', this.seo.title).toLowerCase() + "-" + d.getFullYear() + "-" + Utils.zeroPrefix(d.getMonth()) + "-" + Utils.zeroPrefix(d.getDate()) + "-" + Utils.zeroPrefix(d.getHours())
        this.p = new ParametersString(this.crudConfig.crudName)
        this.getData(this.p.getParametersString())


        /**
         * triggers getData on filter change
         */
        this.filter.getSystem().onFilterChange.subscribe(event => {
            console.log(event)
        });


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
        let paramsExport = "?uirequest=true&limit=" + this.page.totalElements + "&" + this.search.getRequestParameters()
        return this.service
            .getData(paramsExport)
            .pipe(takeUntil(this.ngUnsubscribe))
    }





    private parseEvent(): void {
        this.setParameters()
        this.p.saveParametersString()
        this.getData(this.p.getParametersString())
    }



    private getData(params: string): void {


        this.service
            .getData(params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    this.page = <any>response.body
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
            this.search.setSearch($event.params.value)
            this.search.setSearchBy($event.params.name)
            this.page.pageable.pageNumber = 0
            this.parseEvent()
        }

        if (!this.timeouts.hasOwnProperty($event.event)) this.timeouts[$event.event] = []
        this.timeouts[$event.event].push(setTimeout(timeoutParseEvent, 600))

        while (this.timeouts[$event.event].length > 1) {
            clearTimeout(this.timeouts[$event.event][0])
            this.timeouts[$event.event].shift()
        }
    }




    // refactor below
    // translateEventSort($event: any) {

    //     this.search.setOrderDir($event.direction)
    //     this.search.setOrderBy($event.active)
    //     this.parseEvent()
    // }


    // translateEventPagination($event: any): any {

    //     if (!$event.hasOwnProperty("event") && $event.hasOwnProperty("pageSize") && $event.hasOwnProperty("pageIndex")) {
    //         this.page.pageable.setPageSize($event.pageSize)
    //         this.page.pageable.setOffset($event.pageIndex)
    //         this.page.pageable.pageNumber = $event.pageIndex
    //         this.parseEvent()
    //     }
    // }

    // remove this function
    private setParameters = () => {

        this.p.setParam('orderby', this.search.getOrderBy())
        this.p.setParam('orderdir', this.search.getOrderDir())
        this.p.setParam('searchby', this.search.getSearchBy())
        this.p.setParam('search', this.search.getSearch())
        this.p.setParam('limit', this.page.pageable.getPageSize().toString())
        this.p.setParam('offset', this.page.pageable.getPageNumber().toString())
        this.p.saveParametersString()
    }


}
