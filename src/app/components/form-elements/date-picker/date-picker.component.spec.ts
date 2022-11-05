import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePicker } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePicker;
  let fixture: ComponentFixture<DatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePicker ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
