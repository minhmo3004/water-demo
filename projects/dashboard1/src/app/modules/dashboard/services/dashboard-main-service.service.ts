import { Injectable } from '@angular/core';
import { DashBoardData } from '../models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardMainServiceService {

  private MockDashBoardData: DashBoardData[] = [
  {
    id: 1,
    anomaly_count: 5,
    anomaly_verified: 5,
    meter_data: {
      id: 1,
      name: 'Van Dau 8',
      address: 'Abc',
      status: 1
    }
  },
  {
    id: 2,
    anomaly_count: 3,
    anomaly_verified: 2,
    meter_data: {
      id: 2,
      name: 'Van Dau 9',
      address: 'Xyz',
      status: 0
    }
  },
  {
    id: 3,
    anomaly_count: 7,
    anomaly_verified: 6,
    meter_data: {
      id: 3,
      name: 'Van Dau 10',
      address: '123 Street',
      status: 1
    }
  },
  {
    id: 4,
    anomaly_count: 2,
    anomaly_verified: 1,
    meter_data: {
      id: 4,
      name: 'Van Dau 11',
      address: 'Main Road',
      status: 0
    }
  },
  {
    id: 5,
    anomaly_count: 8,
    anomaly_verified: 7,
    meter_data: {
      id: 5,
      name: 'Van Dau 12',
      address: 'Central Ave',
      status: 1
    }
  },
  {
    id: 6,
    anomaly_count: 4,
    anomaly_verified: 3,
    meter_data: {
      id: 6,
      name: 'Van Dau 13',
      address: 'North Street',
      status: 0
    }
  },
  {
    id: 7,
    anomaly_count: 6,
    anomaly_verified: 5,
    meter_data: {
      id: 7,
      name: 'Van Dau 14',
      address: 'South Park',
      status: 1
    }
  },
  {
    id: 8,
    anomaly_count: 1,
    anomaly_verified: 0,
    meter_data: {
      id: 8,
      name: 'Van Dau 15',
      address: 'West Lane',
      status: 0
    }
  },
  {
    id: 9,
    anomaly_count: 9,
    anomaly_verified: 8,
    meter_data: {
      id: 9,
      name: 'Van Dau 16',
      address: 'East Road',
      status: 1
    }
  },
  {
    id: 10,
    anomaly_count: 0,
    anomaly_verified: 0,
    meter_data: {
      id: 10,
      name: 'Van Dau 17',
      address: 'Downtown',
      status: 0
    }
  },
  {
    id: 11,
    anomaly_count: 10,
    anomaly_verified: 9,
    meter_data: {
      id: 11,
      name: 'Van Dau 18',
      address: 'Uptown',
      status: 1
    }
  }
];

  getMockData(): Observable<DashBoardData[]> {
    return of(this.MockDashBoardData);
  }

  constructor() { }
}
