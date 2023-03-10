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
    Renderer2
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
import { PaginatorDirective } from 'src/app/directives/paginator.directive'

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

    @ViewChild('paginator', { static: false }) paginator: MatPaginator
    @ViewChild('paginator', { static: false }) paginatorEl: TemplateRef<any>
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
    public multiOrder = false
    public exportFileName: string
    private timeouts = {}
    private ngUnsubscribe: Subject<void> = new Subject<void>()
    private positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    public toolTipPosition = new FormControl(this.positionOptions[1])
    constructor(
        private readonly cdr: ChangeDetectorRef,
        public filter: Filter,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2
    ) { }

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

        Object.keys(this.displayedColumns).forEach(k => this.filter.setInitialValue("search." + k, this.displayedColumns[k]))
        this.filter.doNotStore = this.sensitiveColumns
        this.filter.storageName = this.crudConfig.crudName + '_filter'



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
        this.getObjectValue(this, 'paginator').__ngContext__
        .filter(n => n != null && n.hasOwnProperty('setLabelPage'))
        .forEach(el =>  el.setLabelPage(+this.filter.offset + 1))
        this.getData(this.filter.getParameterAndEncodedValue())
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
                    if (this.filter.limit > response.body.length) this.page.totalElements = (this.page.pageable.getOffset() * +this.filter.limit) + +this.filter.limit
                },
                error: (response: any) => {
                    // console.log(<any>response)
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


    translatePaginatorEvent($event) {
        this.filter.setValue('limit', $event.pageSize, false)
        this.filter.setValue('offset', $event.pageIndex, false)
        this.parseEvent()
    }



}
