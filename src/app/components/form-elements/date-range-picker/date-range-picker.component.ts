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

    @Input() searchFilter: Filter
    @Input() fieldName: string
    public fieldNameStart: string
    public fieldNameEnd: string
    public startRange: Date | ''
    public endRange: Date | ''

    constructor() {
    }

    ngOnInit(): void {

        let startD = this.searchFilter.getValue('search.' + this.fieldName + '.startRange')
        let endD = this.searchFilter.getValue('search.' + this.fieldName + '.endRange')
        if (startD) this.startRange = new Date(startD)
        if (endD) this.endRange = new Date(endD)

        this.searchFilter.onFilterChange.subscribe(event => {
            let startD = this.searchFilter.getValue('search.' + this.fieldName + '.startRange')
            let endD = this.searchFilter.getValue('search.' + this.fieldName + '.endRange')
            if (!startD) this.startRange = startD
            if (!endD) this.endRange = endD
        })

    }
    // TODO: check if a different higher level event can be used in order to reduce events
    dateRangeChange(searchString: string, dateInputFieldValue: string) {
        this.searchFilter.setValue(searchString, dateInputFieldValue)
        this.searchFilter.setValue('offset', 0)
    }

}
