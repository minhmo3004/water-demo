import { TestBed } from '@angular/core/testing';

import { ClockServiceService } from './clock-service.service';

describe('ClockServiceService', () => {
  let service: ClockServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
