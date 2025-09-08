import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTableComponent } from './meter-table.component';

describe('MeterTableComponent', () => {
  let component: MeterTableComponent;
  let fixture: ComponentFixture<MeterTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeterTableComponent]
    });
    fixture = TestBed.createComponent(MeterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
