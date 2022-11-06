import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})

export class DateRangePicker implements OnInit {


  constructor() { }

  ngOnInit(): void {
    
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    return {dateFilter: {startDate: dateRangeStart.value, endDate: dateRangeEnd.value}}
  }

}
