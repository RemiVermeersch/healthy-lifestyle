import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyFinanceComponent } from './economy-finance.component';

describe('EconomyFinanceComponent', () => {
  let component: EconomyFinanceComponent;
  let fixture: ComponentFixture<EconomyFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomyFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
