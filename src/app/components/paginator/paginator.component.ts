import { Component, Input, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator'
@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
    // TODO: update currentpage after filtering
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
        // this.matPaginatorIntl.getRangeLabel(3,4,500)
    }

}

