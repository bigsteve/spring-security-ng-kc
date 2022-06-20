import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator'
@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
    
    @ViewChild('paginator') paginator: MatPaginator;
    @Input() length: number
    @Input() pageSize: number
    @Input() pageSizeOptions: number[] = [50, 100, 150, 250, 500]
    @Input() ariaLabel: string = "Select page"
    @Input() pageIndex: number = 0

    private matPaginatorIntl: MatPaginatorIntl

    constructor(matPaginatorIntl: MatPaginatorIntl) {
        this.matPaginatorIntl = matPaginatorIntl
    }

    ngOnInit() {
    }


    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes)
        if(changes.length.currentValue < changes.length.previousValue) {
            this.paginator.firstPage()
        }
    }
}

