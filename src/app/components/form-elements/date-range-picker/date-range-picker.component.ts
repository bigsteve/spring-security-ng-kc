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

        let startD = this.filter.getValue('search.' + this.fieldName + '.startDate')
        let endD = this.filter.getValue('search.' + this.fieldName + '.endDate')
        if (startD) this.startDate = new Date(startD)
        if (endD) this.endDate = new Date(endD)

        this.filter.onFilterChange.subscribe(event => {
            let startD = this.filter.getValue('search.' + this.fieldName + '.startDate')
            let endD = this.filter.getValue('search.' + this.fieldName + '.endDate')
            if (!startD) this.startDate = startD
            if (!endD) this.endDate = endD
        })

    }
    // TODO: check if a different higher level event can be used in order to reduce events
    dateRangeChange(searchString: string, dateInputFieldValue: string) {
        this.filter.setValue(searchString, dateInputFieldValue)
        this.filter.setValue('offset', 0)
    }

}
