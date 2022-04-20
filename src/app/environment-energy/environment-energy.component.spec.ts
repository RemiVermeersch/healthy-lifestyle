import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentEnergyComponent } from './environment-energy.component';

describe('EnvironmentEnergyComponent', () => {
  let component: EnvironmentEnergyComponent;
  let fixture: ComponentFixture<EnvironmentEnergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentEnergyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
