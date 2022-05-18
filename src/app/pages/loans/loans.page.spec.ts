import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoansPage } from './loans.page';

describe('LoansPage', () => {
  let component: LoansPage;
  let fixture: ComponentFixture<LoansPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
