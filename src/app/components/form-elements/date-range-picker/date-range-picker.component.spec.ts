import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangePicker } from './date-range-picker.component';

describe('DateRangePickerComponent', () => {
  let component: DateRangePicker;
  let fixture: ComponentFixture<DateRangePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateRangePicker ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
