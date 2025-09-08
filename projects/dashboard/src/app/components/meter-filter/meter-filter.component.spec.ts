import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterFilterComponent } from './meter-filter.component';

describe('MeterFilterComponent', () => {
  let component: MeterFilterComponent;
  let fixture: ComponentFixture<MeterFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeterFilterComponent]
    });
    fixture = TestBed.createComponent(MeterFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
