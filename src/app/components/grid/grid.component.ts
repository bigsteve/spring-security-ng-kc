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
import { Page } from 'src/app/model/page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { Search } from 'src/app/model/pageable/search.model'
import { MatSort } from '@angular/material/sort';
import { UniformEvent } from 'src/app/interfaces/uniform.event'

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
    public page: Page = new Page()
    public search: Search = new Search()
    private params: string = '?limit=50&offset=0'
    public isLoading: boolean = false
    public exportFileName: string
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()


    constructor(
        private readonly cdr: ChangeDetectorRef
    ) { }

    translateEventRowClick(event: any) {
        const ev = event
        console.log(ev)
    }

    translateEventFilter(event: any) {

        const ev = event
        console.log(ev)
        // this.eventEmitted(ev)
    }

    translateEventSort(event: any) {
        const ev = {event: 'onOrder', value: { key: event.active, order: event.direction}}
        this.eventEmitted(ev)
    }

    zeroPrefix(n: number): string {
        return (n < 10) ? "0" + n : n.toString()
    }

    ngOnInit(): void {

        this.displayedColumns = this.columns.map(el => el.key)
        console.log(this.columns.map(el => el.key))
        this.columns.forEach(el => {
            if (el.hasOwnProperty("cellTemplate")) {
                el.cellTemplate = this[el.cellTemplate]
            }
        })


        const d = new Date()
        this.exportFileName = this.seo.title.replace(" ", "-").toLowerCase() + "-" + d.getFullYear() + "-" + this.zeroPrefix(d.getMonth()) + "-" + this.zeroPrefix(d.getDate()) + "-" + this.zeroPrefix(d.getHours())
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
    }


    private parseEvent(obj: EventObject): void {

        this.page.pageable.setPageSize(obj.value.limit)
        this.page.pageable.setOffset(obj.value.page)

        if (obj.event === 'onOrder') {

            this.search.setOrderDir(obj.value.order)
            this.search.setOrderBy(obj.value.key)
        }

        if (obj.event === 'onSearch') {
            this.search.setSearch(obj.value[0].value)
            this.search.setSearchBy(obj.value[0].key)
            this.page.pageable.pageNumber = 0
        }

        if (obj.event === 'onMatPagination') {
            this.page.pageable.pageNumber = obj.value.page
        }

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
                    this.cdr.detectChanges()
                },
                error: (error: any) => {
                    console.error('Error: ', error.message)
                },
                complete: null
            })
    }

    debugVal(v: any): any {
        if (isDevMode()) console.log('Debug val: ', v)
        return v
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
        }
        return $event
    }
}
