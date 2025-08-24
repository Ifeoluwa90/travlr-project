import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private baseUrl = 'http://localhost:3000/api';
  private tripsUrl = `${this.baseUrl}/trips`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Get all trips
  getTrips(): Observable<Trip[]> {
    console.log('🔄 TripDataService: Getting all trips from API URL:', this.tripsUrl);
    console.log('🔄 HTTP client instance:', this.http);
    
    const request = this.http.get<Trip[]>(this.tripsUrl).pipe(
      retry(1),
      catchError((error) => {
        console.error('🚨 Raw HTTP error in service:', error);
        return this.handleError(error);
      })
    );
    
    console.log('🔄 Request observable created:', request);
    return request;
  }

  // Get single trip by code
  getTrip(tripCode: string): Observable<Trip> {
    console.log(`🔄 Getting trip ${tripCode} from API`);
    const url = `${this.tripsUrl}/${tripCode}`;
    return this.http.get<Trip>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Add new trip
  addTrip(trip: Trip): Observable<any> {
    console.log('🔄 Adding new trip to API:', trip);
    return this.http.post<any>(this.tripsUrl, trip, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update existing trip
  updateTrip(tripCode: string, trip: Partial<Trip>): Observable<any> {
    console.log(`🔄 Updating trip ${tripCode} in API:`, trip);
    const url = `${this.tripsUrl}/${tripCode}`;
    return this.http.put<any>(url, trip, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete trip
  deleteTrip(tripCode: string): Observable<any> {
    console.log(`🔄 Deleting trip ${tripCode} from API`);
    const url = `${this.tripsUrl}/${tripCode}`;
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    
    console.error('❌ API Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}