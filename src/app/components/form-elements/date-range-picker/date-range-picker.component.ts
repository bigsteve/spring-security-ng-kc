import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filter } from 'src/app/model/search/filter.model';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss'],
    providers: [DatePipe]
})

export class DateRangePicker implements OnInit {

    @Input() filter: Filter
    @Input() fieldName: string
    public fieldNameStart: string
    public fieldNameEnd: string
    public startDate: Date | ''
    public endDate: Date | ''

    constructor() { 
    }

    ngOnInit(): void {
        
        if (!this.filter.search[this.fieldName]) this.filter.search[this.fieldName] = {}
        if (this.filter.search[this.fieldName].hasOwnProperty('startDate')) this.startDate = new Date(this.filter.search[this.fieldName].startDate)
        if (this.filter.search[this.fieldName].hasOwnProperty('endDate')) this.endDate = new Date(this.filter.search[this.fieldName].endDate)

        this.filter.onFilterChange.subscribe(event => {
            if (!this.filter.search[this.fieldName]) this.startDate = null
            if (!this.filter.search[this.fieldName]) this.endDate = null
        })

    }
    // TODO: check if I gan use different higher level event in order to trigger less events on filer
    dateRangeChange(searchString: string, dateInputFieldValue: string) {
        this.filter.setValue(searchString, dateInputFieldValue)
        this.filter.setValue('offset', 0)
    }

}
