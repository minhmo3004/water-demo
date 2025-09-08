import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DetailData } from '../models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailServiceService {
  private apiUrl = 'https://api.example.com/details';
  http = inject(HttpClient);


  getDetailsByMeterId(meterId: number): Observable<DetailData[]> {
    const meterSpecificData: DetailData[] = [
      {
        id: 1,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T08:00:00+07:00'),
        flow: 120.5,
        prediction: 0,
        predConfidence: 0.95
      },
      {
        id: 2,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T08:15:00+07:00'),
        flow: 125.3,
        prediction: 0,
        predConfidence: 0.92
      },
      {
        id: 3,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T08:30:00+07:00'),
        flow: 118.7,
        prediction: 0,
        predConfidence: 0.88
      },
      {
        id: 4,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T08:45:00+07:00'),
        flow: 142.1,
        prediction: 1,
        predConfidence: 0.85
      },
      {
        id: 5,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T09:00:00+07:00'),
        flow: 156.8,
        prediction: 1,
        predConfidence: 0.91
      },
      {
        id: 6,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T09:15:00+07:00'),
        flow: 145.2,
        prediction: 1,
        predConfidence: 0.87
      },
      {
        id: 7,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T09:30:00+07:00'),
        flow: 128.4,
        prediction: 0,
        predConfidence: 0.93
      },
      {
        id: 8,
        name: `Van Dau ${meterId}`,
        timeStamp: new Date('2025-09-03T09:45:00+07:00'),
        flow: 135.6,
        prediction: 0,
        predConfidence: 0.89
      }
    ];

    return of(meterSpecificData);
  }

  getData() {
    return this.http.get<DetailData[]>(this.apiUrl);
  }
  constructor() { }
}
