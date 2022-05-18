import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

    page: number
    prev: number
    next: number
    heading = new Array()
    data = new Array()

    constructor() {
    }

    ngOnInit(): void {
        this.navigateTo(this.page)
    }

    navigateTo(toPage: number): void {
    }

}
