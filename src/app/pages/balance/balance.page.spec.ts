import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancePage } from './balance.page';

describe('BalancePage', () => {
  let component: BalancePage;
  let fixture: ComponentFixture<BalancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalancePage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
