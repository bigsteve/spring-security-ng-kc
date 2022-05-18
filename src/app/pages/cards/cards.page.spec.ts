import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardsPage } from './cards.page';

describe('CardsPage', () => {
  let component: CardsPage;
  let fixture: ComponentFixture<CardsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
