import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private tokenKey = 'travlr-token';
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in on service initialization
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.extractUserFromToken(token);
      this.currentUserSubject.next(user);
    }
  }

  public login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/login`, credentials)
      .pipe(
        map((response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            const user = this.extractUserFromToken(response.token);
            this.currentUserSubject.next(user);
            return true;
          }
          return false;
        })
      );
  }

  public register(user: { name: string; email: string; password: string }): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/register`, user)
      .pipe(
        map((response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            const userData = this.extractUserFromToken(response.token);
            this.currentUserSubject.next(userData);
            return true;
          }
          return false;
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < (Date.now() / 1000);
    } catch (error) {
      return true;
    }
  }

  private extractUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.email,
        name: payload.name
      };
    } catch (error) {
      return null;
    }
  }
}