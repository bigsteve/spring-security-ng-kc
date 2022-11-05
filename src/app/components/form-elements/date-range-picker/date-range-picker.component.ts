import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})

export class DateRangePicker implements OnInit {
    events: string[] = [];

    range = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
    });
  constructor() { }

  ngOnInit(): void {
    
  }

}
