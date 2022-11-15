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
    // @ViewChild('dateRangeStart', { static: false }) public dateRangeStart: HTMLInputElement;

    public fieldNameStart: string
    public fieldNameEnd: string
    public startDate: Date | ''
    public endDate: Date | ''

    constructor() { 
    }

    ngOnInit(): void {
        
        this.fieldNameStart = this.fieldName+'Start'
        this.fieldNameEnd = this.fieldName+'End'
        if (this.filter.search.hasOwnProperty(this.fieldNameStart)) this.startDate = new Date(this.filter.search[this.fieldNameStart])
        if (this.filter.search.hasOwnProperty(this.fieldNameEnd)) this.endDate = new Date(this.filter.search[this.fieldNameEnd])

        this.filter.system.onFilterChange.subscribe(event => {
            if (!this.filter.search[this.fieldNameStart]) this.startDate = null
            if (!this.filter.search[this.fieldNameStart]) this.endDate = null
        })

    }

    dateRangeChange(searchString: string, dateInputFieldValue: string) {
        this.filter.setValue(searchString, dateInputFieldValue)
    }

}
