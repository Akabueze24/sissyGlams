import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { tap, catchError, of } from 'rxjs';

import { Login } from '../../models/auth-models/login.mdel';
import { Register } from '../../models/auth-models/register.model';
import { User } from '../../models/auth-models/user.model';
import { AuthModalRequest } from '../../models/auth-models/auth-modal-request.model';

import { ToastService } from '../toast-service/toast.service';
import { environment } from 'src/environments/environment';

export type AuthMode = 'login' | 'register';

/** Login / verify-email success */
interface AuthResponse {
  user: User;
  token: string;
}

/** Register success — no session yet */
interface RegisterPendingResponse {
  email: string;
  requiresEmailVerification: true;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ============================================================
  // STORAGE
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
  // Does NOT log the user in (no token from API)
  // ============================================================

  register(
    registerData: Register,
  ): Observable<RegisterPendingResponse | null> {
    const payload = {
      firstName: registerData.firstName.trim(),
      lastName: registerData.lastName.trim(),
      email: registerData.email.trim().toLowerCase(),
      password: registerData.password,
    };

    return this.http
      .post<RegisterPendingResponse>(
        `${environment.apiUrl}/auth/register`,
        payload,
      )
      .pipe(
        tap(() => {
          // Intentionally NO persistSession here
          this.toastService.success(
            'Account created. Please verify your email with the code we sent.',
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
  // Backend rejects unverified accounts (403)
  // ============================================================

  login(loginData: Login): Observable<AuthResponse | { needsVerification: true; email: string } | null> {
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
        const body = err?.error;
        if (
          err?.status === 403 &&
          body?.requiresEmailVerification === true &&
          body?.email
        ) {
          // Do not toast as a hard failure — parent will open OTP
          return of({
            needsVerification: true as const,
            email: String(body.email).toLowerCase(),
          });
        }

        const msg =
          body?.message || 'Incorrect email or password.';
        this.toastService.error(msg);
        return of(null);
      }),
    );
}

  // ============================================================
  // EMAIL VERIFICATION (public — email + code)
  // ============================================================

  /**
   * POST /api/auth/verify-email
   * Body: { email, code }
   * Success → session starts here
   */
  verifyEmail(email: string, code: string): Observable<User | null> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/verify-email`, {
        email: email.trim().toLowerCase(),
        code: String(code).trim(),
      })
      .pipe(
        tap((res) => {
          this.persistSession(res.user, res.token);
          this.toastService.success('Your email has been verified.');
        }),
        map((res) => res.user),
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'Invalid or expired verification code.';
          this.toastService.error(msg);
          return of(null);
        }),
      );
  }

  /**
   * POST /api/auth/resend-verification
   * Body: { email }
   */
  resendEmailVerification(email: string): Observable<boolean> {
    return this.http
      .post<{ message?: string }>(
        `${environment.apiUrl}/auth/resend-verification`,
        { email: email.trim().toLowerCase() },
      )
      .pipe(
        tap(() => {
          this.toastService.success(
            'If that email needs verification, a new code has been sent.',
          );
        }),
        map(() => true),
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'Could not send verification code. Please try again.';
          this.toastService.error(msg);
          return of(false);
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

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  isEmailVerified(): boolean {
    return this.getCurrentUser()?.emailVerified === true;
  }

  // ============================================================
  // PROFILE → PATCH /api/auth/me
  // ============================================================

  updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): Observable<User | null> {
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
    };

    return this.http
      .patch<{ user: User }>(`${environment.apiUrl}/auth/me`, payload)
      .pipe(
        tap((res) => {
          this.persistSession(res.user, this.getToken());
          this.toastService.success(
            'Your account has been updated successfully.',
          );
        }),
        map((res) => res.user),
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'Could not update your account. Please try again.';
          this.toastService.error(msg);
          return of(null);
        }),
      );
  }

  // ============================================================
  // PASSWORD CHANGE (email code) — still requires JWT
  // ============================================================

  requestPasswordChangeCode(): Observable<boolean> {
    return this.http
      .post<{ message?: string }>(
        `${environment.apiUrl}/auth/me/password/request-code`,
        {},
      )
      .pipe(
        tap(() => {
          this.toastService.success(
            'A verification code has been sent to your email.',
          );
        }),
        map(() => true),
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'Could not send verification code. Please try again.';
          this.toastService.error(msg);
          return of(false);
        }),
      );
  }

  confirmPasswordChange(
    currentPassword: string,
    code: string,
    newPassword: string,
  ): Observable<boolean> {
    return this.http
      .post<{ message?: string }>(
        `${environment.apiUrl}/auth/me/password/confirm`,
        {
          currentPassword,
          code: String(code).trim(),
          newPassword,
        },
      )
      .pipe(
        tap(() => {
          this.toastService.success(
            'Your password has been updated successfully.',
          );
        }),
        map(() => true),
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'Could not update password. Please try again.';
          this.toastService.error(msg);
          return of(false);
        }),
      );
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