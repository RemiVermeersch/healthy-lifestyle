import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfPercievedHealthComponent } from './self-percieved-health.component';

describe('SelfPercievedHealthComponent', () => {
  let component: SelfPercievedHealthComponent;
  let fixture: ComponentFixture<SelfPercievedHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfPercievedHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfPercievedHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
