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
    ViewContainerRef,
    Output,
    ElementRef,
    Directive,
    NgZone,
    EventEmitter
} from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Observable, Subject, filter } from 'rxjs'
import { DataPage } from 'src/app/model/data.page.model'
import { Pageable } from 'src/app/model/pageable/pageable.model'
import { MatPaginator } from '@angular/material/paginator'
import { Seo } from 'src/app/model/seo/seo.model'
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip'
import { Utils } from 'src/app/utils/utils.model'
import { Filter } from 'src/app/model/search/filter.model'
import { MatDialog } from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'

/**
 * 
 */
@Directive()
export class GridmasterComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('paginator', { static: false }) public paginator: MatPaginator
    @ViewChild('pipeCurrency', { static: true }) public pipeCurrency: TemplateRef<any>
    @ViewChild('pipeDateShort', { static: true }) public pipeDateShort: TemplateRef<any>
    @ViewChild('pipeDateShortThTemplate', { static: true }) public pipeDateShortThTemplate: TemplateRef<any>
    @ViewChild('rowActions', { static: true }) public rowActions: TemplateRef<any>
    @ViewChild(MatTable) public table: MatTable<any>
    
    @Input() crudConfig: any
    @Input() seo: Seo
    @Input() service: any
    @Input() columns: any

    @Output()
    public watchGrid = new EventEmitter<{event: string, params: any}>();
    public gridObserver: Observable<any>

    public displayedColumns: object
    public actionColumns: string[] = []
    public hiddenColumns: string[] = []
    public sensitiveColumns: string[] = []
    public page: DataPage = new DataPage()
    public multiOrder = false
    public exportFileName: string
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()
    private positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    public toolTipPosition = new FormControl(this.positionOptions[1])
    public t: MatTable<any>
    public rowEvent: {event: string, params: any} = {event: 'rowClick', params: {row: 0, col: 0}};

    public openDialog(v: any) {
        console.log('parent openDialog')
    }

    constructor(
        private readonly cdr: ChangeDetectorRef,
        public searchFilter: Filter,
        public dialog: MatDialog,
        public viewContainerRef: ViewContainerRef
    ) {}

    test(v) {
        return v+" blabla";
    }
    getObjectValue(object: any, k: string) {
        return Utils.getObjectValue(object, k)
    }

    displayedColumnsArray(v: object) {
        return Object.keys(v).concat(this.actionColumns)
    }

    removeColumn() {
        delete this.displayedColumns[Object.keys(this.displayedColumns).pop()]
        console.log(this.displayedColumns)
        console.log(this.searchFilter)
        console.log(this.searchFilter.getFromLocalStorage())
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

        Object.keys(this.displayedColumns).forEach(k => this.searchFilter.setInitialValue("search." + k, this.displayedColumns[k]))
        this.searchFilter.doNotStore = this.sensitiveColumns
        this.searchFilter.storageName = this.crudConfig.crudName + '_filter'



        const d = new Date()
        this.exportFileName = Utils.strReplaceAll(' ', '-', this.seo.title).toLowerCase() + "-" + d.getFullYear() + "-" + Utils.zeroPrefix(d.getMonth()) + "-" + Utils.zeroPrefix(d.getDate()) + "-" + Utils.zeroPrefix(d.getHours())
        this.getData(this.searchFilter.getParameterAndEncodedValue())
        this.searchFilter.onFilterChange.subscribe(event => this.translateEventFilter(event))
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
        let filterNewObj = JSON.parse(this.searchFilter.getJson())
        filterNewObj.limit = this.page.totalElements
        filterNewObj.offset = 0
        let paramsExport = '?export=true&params=' + new URLSearchParams(JSON.stringify(filterNewObj)).toString()
        return this.service
            .getData(paramsExport)
            .pipe(takeUntil(this.ngUnsubscribe))
    }



    private parseEvent(): void {
        this.getObjectValue(this, 'paginator').__ngContext__
        .filter(n => n != null && n.hasOwnProperty('setLabelPage'))
        .forEach(el =>  el.setLabelPage(+this.searchFilter.offset + 1))
        this.getData(this.searchFilter.getParameterAndEncodedValue())
    }



    private getData(params: string): void {

        // let bb = {}
        // bb["id"]="d630b8be-a9cf-11ed-9e6f-27579a6933ce",
        // bb["companyName"]="Coman & compan"
        // bb["load"]= "Bricks and irons"
        // bb["weight"]= 222.45
        // let s = {}
        // s["search"] = bb
        // console.log(new URLSearchParams(JSON.stringify(bb)).toString())
        

        this.service
            .getData(params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    this.page.data = <any>response.body
                    if (isDevMode()) console.log(this.page)
                    this.page.pageable = new Pageable(this.page.pageable)
                    this.page.totalElements = (this.page.data.length > 0) ? Infinity : 0
                    if (this.searchFilter.limit > response.body.length) this.page.totalElements = (this.page.pageable.getOffset() * +this.searchFilter.limit) + +this.searchFilter.limit
                },
                error: (response: any) => {
                },
                complete: () => {
                    this.cdr.detectChanges()
                }
            })
    }



    translateEventRowClick($event: any) {
        this.openDialog($event)
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


    translatePaginatorEvent($event) {
        this.searchFilter.setValue('limit', $event.pageSize, false)
        this.searchFilter.setValue('offset', $event.pageIndex, false)
        this.parseEvent()
    }



    getTable() {
        return this.table
    }

}
