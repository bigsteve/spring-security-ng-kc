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
    HostListener,
    EventEmitter
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DataPage } from 'src/app/model/data.page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { Search } from 'src/app/model/pageable/search.model'
import { MatSort } from '@angular/material/sort';
import { UniformEvent } from 'src/app/interfaces/uniform.event'
import {FormControl} from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip'
import { Utils } from 'src/app/utils/utils.model'

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
    refine events for sort, filter, row-click and apply them
*/
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostListener('matSortChange', ['$event'])
    sortChange(e) {
        // save cookie with table sort data here
        let ev: UniformEvent = {
            event: '',
            params: {
                name: '',
                value: ''
            }
        }
        ev.event = "matSortChange"
        ev.params.name = e.active
        ev.params.value = e.direction
        new EventEmitter().emit(ev)
    }

    @ViewChild('paginator', { static: true }) paginator: MatPaginator
    @ViewChild('pipeCurrency', { static: true }) pipeCurrency: TemplateRef<any>;
    @ViewChild('pipeDateShort', { static: true }) public pipeDateShort: TemplateRef<any>;
    @ViewChild('rowActions', { static: true }) public rowActions: TemplateRef<any>;
    @ViewChild(MatSort) sort: MatSort;

    @Input() crudConfig: any
    @Input() seo: Seo = new Seo()
    @Input() service: any
    @Input() columns: any
    public displayedColumns: []
    public page: DataPage = new DataPage()
    public search: Search = new Search()
    private params: string = '?limit=50&offset=0'
    public isLoading: boolean = false
    public exportFileName: string
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()
    private positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    public toolTipPosition = new FormControl(this.positionOptions[1])
        // this.isLoading = new BehaviorSubject<boolean>(false)

    constructor(
        private readonly cdr: ChangeDetectorRef
    ) { }


    ngOnInit(): void {

        this.displayedColumns = this.columns.map(el => el.key)
        let cols = []
        this.columns.forEach(el => {
            cols.push(el.key)
            if (el.hasOwnProperty("cellTemplate")) {
                el.cellTemplate = this[el.cellTemplate]
            }
        })

        // this.params += "&cols[]="+cols.join("&cols[]=")

        const d = new Date()
        this.exportFileName = this.seo.title.replace(" ", "-").toLowerCase() + "-" + d.getFullYear() + "-" + Utils.zeroPrefix(d.getMonth()) + "-" + Utils.zeroPrefix(d.getDate()) + "-" + Utils.zeroPrefix(d.getHours())
        this.getData(this.params)

    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.complete()
    }

    ngAfterViewInit() {
    }


    exportData() {
        let paramsExport = "?limit=" + this.page.totalElements + "&" + this.search.getRequestParameters()

        return this.service
            .getData(paramsExport)
            .pipe(takeUntil(this.ngUnsubscribe))
    }





    private parseEvent(): void {

        this.params = "?" + this.page.pageable.getRequestParameters() + "&" + this.search.getRequestParameters()
        this.getData(this.params)
    }



    private getData(params: string): void {

        this.isLoading = true

        this.service
            .getData(params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    this.page = <any>response.body
                    if (isDevMode()) console.log(this.page)

                    this.page.pageable = new Pageable(this.page.pageable)
                    this.isLoading = false
                },
                error: (error: any) => {
                    this.isLoading = false
                    console.error('Error: ', error.message)
                },
                complete: () => {
                    this.cdr.detectChanges()
                }
            })
    }



    debugVal(v: any): any {
        if (isDevMode()) console.log('Debug val: ', v)
        return v
    }



    translateEventRowClick($event: any) {
        console.log($event)
    }



    translateEventFilter($event: any) {

        console.log($event)
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


    translateEventSort($event: any) {

        this.search.setOrderDir($event.direction)
        this.search.setOrderBy($event.active)
        this.parseEvent()
    }


    translateEventPagination($event: any): any {

        if (!$event.hasOwnProperty("event") && $event.hasOwnProperty("pageSize") && $event.hasOwnProperty("pageIndex")) {
            this.page.pageable.setPageSize($event.pageSize)
            this.page.pageable.setOffset($event.pageIndex)
            this.page.pageable.pageNumber = $event.pageIndex
            this.parseEvent()
        }
    }
}
