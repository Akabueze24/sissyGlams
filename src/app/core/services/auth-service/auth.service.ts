import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Login } from '../../models/auth-models/login.mdel';
import { Register } from '../../models/auth-models/register.model';
import { User } from '../../models/auth-models/user.model';
import { AuthModalRequest } from '../../models/auth-models/auth-modal-request.model';

import { ToastService } from '../toast-service/toast.service';

// New type for the modal request
export type AuthMode = 'login' | 'register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ============================================================
  // AUTHENTICATED USER
  // ============================================================

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUser(),
  );

  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  // ============================================================
  // AUTH MODAL CONTROL
  // ============================================================

  // This Subject is used to tell the AuthComponent to open
  private authModalRequestSubject = new Subject<AuthModalRequest>();

  // Components can subscribe to this
  authModalRequest$ = this.authModalRequestSubject.asObservable();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // OPEN AUTH MODAL
  // ============================================================

  /**
   * Call this method from anywhere (Guard, Header, Checkout, etc.)
   * to open the Auth modal.
   */
  openAuthModal(
    mode: AuthMode = 'login',
    redirectUrl: string = '/account',
  ): void {
    console.log('2. AuthService: openAuthModal called');

    this.authModalRequestSubject.next({
      mode,
      redirectUrl,
    });
  }

  // ============================================================
  // REGISTER
  // ============================================================

  register(registerData: Register): void {
    // Temporary implementation.
    // We will connect this to the backend later.

    const user: User = {
      id: crypto.randomUUID(),
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
    };

    this.saveUser(user);

    // Show success toast
    this.toastService.success('Your account has been created successfully.');
  }

  // ============================================================
  // LOGIN
  // ============================================================

  login(loginData: Login): void {
    // Temporary implementation.
    // Real authentication will happen through the backend later.

    const savedUser = this.loadUser();

    if (!savedUser) {
      // User does not exist
      this.toastService.error('Incorrect email or password.');

      return;
    }

    this.currentUserSubject.next(savedUser);

    // Show success toast
    this.toastService.success(`Welcome back, ${savedUser.firstName}!`);
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {
    localStorage.removeItem('sissy-dream-user');

    this.currentUserSubject.next(null);

    // Show success toast
    this.toastService.success('You have been logged out successfully.');
  }

  // ============================================================
  // CHECK AUTHENTICATION
  // ============================================================

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // ============================================================
  // GET CURRENT USER
  // ============================================================

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ============================================================
  // SAVE USER
  // ============================================================

  private saveUser(user: User): void {
    localStorage.setItem('sissy-dream-user', JSON.stringify(user));

    this.currentUserSubject.next(user);
  }

  // ============================================================
  // LOAD USER
  // ============================================================

  private loadUser(): User | null {
    const savedUser = localStorage.getItem('sissy-dream-user');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      return null;
    }
  }

  // ============================================================
  // UPDATE USER
  // ============================================================

  updateUser(user: User): void {
    this.saveUser(user);

    // Show success toast
    this.toastService.success('Your account has been updated successfully.');
  }
}
