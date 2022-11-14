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
    @ViewChild('dateRangeStart', { static: false }) public dateRangeStart: HTMLInputElement;

    private dateSeparator: string = '/'
    public startDate: Date | ''
    public endDate: Date | ''
    public t

    constructor() { }

    ngOnInit(): void {

        if (this.filter.search.hasOwnProperty('startDate')) this.startDate = new Date(this.filter.search.startDate)
        if (this.filter.search.hasOwnProperty('endDate')) this.endDate = new Date(this.filter.search.endDate)

        this.t = this.filter.system.onFilterChange.subscribe(event => {
            if (!this.filter.search.startDate) this.startDate = null
            console.log('filter emitted')
            // this.startDate = ''
            // this.endDate = ''
            console.log(this.startDate)
            
        })

    }





    dateRangeChange(searchString: string, dateInputFieldValue: string) {
        this.filter.setValue(searchString, dateInputFieldValue)
    }



    set defaultStartDate(date) {
        this.filter.search.startDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }

    get defaultStartDate() {

        if (this.filter.search.hasOwnProperty('startDate')) {
            let arrS = this.filter.search.startDate.split(this.dateSeparator)
            return new Date(arrS[2], arrS[0] - 1, arrS[1])
        }
    }

    set defaultEndDate(date) {
        this.filter.search.endDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }

    get defaultEndDate() {
        if (this.filter.search.hasOwnProperty('endDate')) {
            let arrS = this.filter.search.endDate.split(this.dateSeparator)
            return new Date(arrS[2], arrS[0] - 1, arrS[1])
        }
    }

}
