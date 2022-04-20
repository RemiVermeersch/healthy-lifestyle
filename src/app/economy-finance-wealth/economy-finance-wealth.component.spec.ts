import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyFinanceWealthComponent } from './economy-finance-wealth.component';

describe('EconomyFinanceWealthComponent', () => {
  let component: EconomyFinanceWealthComponent;
  let fixture: ComponentFixture<EconomyFinanceWealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomyFinanceWealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyFinanceWealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
