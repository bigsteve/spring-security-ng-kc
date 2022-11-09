import { Component, Input, OnInit } from '@angular/core';
import { Filter } from 'src/app/model/search/filter.model';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss']
})

export class DateRangePicker implements OnInit {

    @Input() filterHasChanged: any
    @Input() filter: Filter

    constructor() { }

    ngOnInit(): void {

    }

    dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
        this.filter.setValue('search.startDate', dateRangeStart.value, false)
        this.filter.setValue('search.endDate', dateRangeEnd.value)
    }

}
