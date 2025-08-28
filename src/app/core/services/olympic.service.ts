import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, delay, retry, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined>(
    undefined
  );

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      retry({
        count: 3,
        delay: 1000,
      }),
      delay(1500),
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  /**
   *  Retourne l'observable Olympics du service
   * @returns
   */

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
