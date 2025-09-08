import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeterSearchService {
  private readonly searchTermSubject = new BehaviorSubject<string>('');

  get searchTerm$(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
}


