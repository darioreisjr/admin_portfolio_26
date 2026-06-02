import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginPayload, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly isAuthenticated = signal<boolean>(!!sessionStorage.getItem(TOKEN_KEY));

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, payload)
      .pipe(
        tap((res) => {
          sessionStorage.setItem(TOKEN_KEY, res.data.token);
          this.isAuthenticated.set(true);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
