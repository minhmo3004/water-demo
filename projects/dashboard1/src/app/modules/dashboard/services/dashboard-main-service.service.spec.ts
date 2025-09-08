import { TestBed } from '@angular/core/testing';

import { DashboardMainServiceService } from './dashboard-main-service.service';

describe('DashboardMainServiceService', () => {
  let service: DashboardMainServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardMainServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
