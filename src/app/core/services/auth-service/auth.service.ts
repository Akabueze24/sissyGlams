import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap, catchError, of } from 'rxjs';

import { Login } from '../../models/auth-models/login.mdel';
import { Register } from '../../models/auth-models/register.model';
import { User } from '../../models/auth-models/user.model';
import { AuthModalRequest } from '../../models/auth-models/auth-modal-request.model';

import { ToastService } from '../toast-service/toast.service';
import { environment } from 'src/environments/environment';

export type AuthMode = 'login' | 'register';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ============================================================
  // STORAGE (session only — accounts live on the server)
  // ============================================================

  private readonly CURRENT_USER_KEY = 'sissy-dream-user';
  private readonly TOKEN_KEY = 'sissy-dream-token';

  // ============================================================
  // AUTHENTICATED USER
  // ============================================================

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadCurrentUser(),
  );

  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  // ============================================================
  // AUTH MODAL
  // ============================================================

  private authModalRequestSubject = new Subject<AuthModalRequest>();
  authModalRequest$ = this.authModalRequestSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  // ============================================================
  // MODAL
  // ============================================================

  openAuthModal(
    mode: AuthMode = 'login',
    redirectUrl: string = '/account',
  ): void {
    this.authModalRequestSubject.next({ mode, redirectUrl });
  }

  // ============================================================
  // REGISTER → POST /api/auth/register
  // ============================================================

 register(registerData: Register): Observable<AuthResponse | null> {
  const payload = {
    firstName: registerData.firstName.trim(),
    lastName: registerData.lastName.trim(),
    email: registerData.email.trim().toLowerCase(),
    password: registerData.password,
  };

  return this.http
    .post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
    .pipe(
      tap((res) => {
        this.persistSession(res.user, res.token);
        this.toastService.success(
          'Your account has been created successfully.',
        );
      }),
      catchError((err) => {
        const msg =
          err?.error?.message ||
          'Could not create account. Please try again.';
        this.toastService.error(msg);
        return of(null);
      }),
    );
}
  // ============================================================
  // LOGIN → POST /api/auth/login
  // ============================================================

  login(loginData: Login): Observable<AuthResponse | null> {
  const payload = {
    email: loginData.email.trim().toLowerCase(),
    password: loginData.password,
  };

  return this.http
    .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
    .pipe(
      tap((res) => {
        this.persistSession(res.user, res.token);
        this.toastService.success(`Welcome back, ${res.user.firstName}!`);
      }),
      catchError((err) => {
        const msg =
          err?.error?.message || 'Incorrect email or password.';
        this.toastService.error(msg);
        return of(null);
      }),
    );
}

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.toastService.success('You have been logged out successfully.');
  }

  // ============================================================
  // HELPERS
  // ============================================================

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** JWT for later (admin guards, Authorization header) */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** is admin  */

  isAdmin(): boolean {
  return this.getCurrentUser()?.role === 'admin';
}

  /**
   * Profile name/email update — session only for now.
   * Wire to PATCH /api/auth/me when you add that route.
   */
  updateUser(user: User): void {
    this.persistSession(user, this.getToken());
    this.toastService.success('Your account has been updated successfully.');
  }



  // ============================================================
  // PRIVATE
  // ============================================================

  private persistSession(user: User, token: string | null): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this.currentUserSubject.next(user);
  }

  private loadCurrentUser(): User | null {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      return null;
    }
  }

  
}