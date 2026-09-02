import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Login } from '../../models/auth-models/login.mdel';
import { Register } from '../../models/auth-models/register.model';
import { User } from '../../models/auth-models/user.model';
import { AuthModalRequest } from '../../models/auth-models/auth-modal-request.model';

import { ToastService } from '../toast-service/toast.service';

// Auth modal modes
export type AuthMode = 'login' | 'register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ============================================================
  // LOCAL STORAGE KEYS
  // ============================================================

  /**
   * Stores the currently logged-in user.
   *
   * This is the user's SESSION.
   */
  private readonly CURRENT_USER_KEY = 'sissy-dream-user';

  /**
   * Stores all registered users.
   *
   * This is the user's ACCOUNT DATABASE for now.
   */
  private readonly REGISTERED_USERS_KEY = 'sissy-dream-users';

  // ============================================================
  // AUTHENTICATED USER
  // ============================================================

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadCurrentUser(),
  );

  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  // ============================================================
  // AUTH MODAL CONTROL
  // ============================================================

  private authModalRequestSubject = new Subject<AuthModalRequest>();

  authModalRequest$ = this.authModalRequestSubject.asObservable();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // OPEN AUTH MODAL
  // ============================================================

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
    /*
     * Get all users that have already registered.
     */
    const registeredUsers = this.loadRegisteredUsers();

    /*
     * Check whether this email is already registered.
     */
    const existingUser = registeredUsers.find(
      (user) => user.email.toLowerCase() === registerData.email.toLowerCase(),
    );

    if (existingUser) {
      this.toastService.error(
        'An account with this email already exists.',
      );

      return;
    }

    /*
     * Create the public user information.
     *
     * Notice that password is NOT stored inside User.
     */
    const user: User = {
      id: crypto.randomUUID(),
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
    };

    /*
     * Create the account record.
     *
     * The password is kept here so login can verify it.
     */
    const registeredUser: RegisteredUser = {
      ...user,
      password: registerData.password,
    };

    /*
     * Add the new account to our registered-users list.
     */
    registeredUsers.push(registeredUser);

    /*
     * Save all registered accounts.
     */
    localStorage.setItem(
      this.REGISTERED_USERS_KEY,
      JSON.stringify(registeredUsers),
    );

    /*
     * Automatically log the newly registered user in.
     */
    this.saveCurrentUser(user);

    /*
     * Show success message.
     */
    this.toastService.success(
      'Your account has been created successfully.',
    );
  }

  // ============================================================
  // LOGIN
  // ============================================================

  login(loginData: Login): void {
    /*
     * Load every account that has registered.
     */
    const registeredUsers = this.loadRegisteredUsers();

    /*
     * Find an account matching BOTH:
     *
     * 1. Email
     * 2. Password
     */
    const registeredUser = registeredUsers.find(
      (user) =>
        user.email.toLowerCase() === loginData.email.toLowerCase() &&
        user.password === loginData.password,
    );

    /*
     * No matching account was found.
     */
    if (!registeredUser) {
      this.toastService.error('Incorrect email or password.');

      return;
    }

    /*
     * Remove the password before putting the user
     * into the currently-logged-in session.
     */
    const user: User = {
      id: registeredUser.id,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
    };

    /*
     * Save the current session.
     */
    this.saveCurrentUser(user);

    /*
     * Show success message.
     */
    this.toastService.success(
      `Welcome back, ${user.firstName}!`,
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {
    /*
     * IMPORTANT:
     *
     * We ONLY remove the currently logged-in user.
     *
     * We DO NOT remove sissy-dream-users.
     *
     * Therefore the account still exists and can be
     * used to login again.
     */
    localStorage.removeItem(this.CURRENT_USER_KEY);

    this.currentUserSubject.next(null);

    this.toastService.success(
      'You have been logged out successfully.',
    );
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
  // SAVE CURRENT USER
  // ============================================================

  private saveCurrentUser(user: User): void {
    /*
     * Store only the public user information.
     *
     * Password is NOT stored here.
     */
    localStorage.setItem(
      this.CURRENT_USER_KEY,
      JSON.stringify(user),
    );

    this.currentUserSubject.next(user);
  }

  // ============================================================
  // LOAD CURRENT USER
  // ============================================================

  private loadCurrentUser(): User | null {
    const savedUser = localStorage.getItem(
      this.CURRENT_USER_KEY,
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      return null;
    }
  }

  // ============================================================
  // LOAD REGISTERED USERS
  // ============================================================

  private loadRegisteredUsers(): RegisteredUser[] {
    const savedUsers = localStorage.getItem(
      this.REGISTERED_USERS_KEY,
    );

    if (!savedUsers) {
      return [];
    }

    try {
      return JSON.parse(savedUsers) as RegisteredUser[];
    } catch {
      return [];
    }
  }

  // ============================================================
  // UPDATE USER
  // ============================================================

  updateUser(user: User): void {
    /*
     * Update the currently logged-in session.
     */
    this.saveCurrentUser(user);

    /*
     * Also update the corresponding registered account.
     *
     * We keep the existing password.
     */
    const registeredUsers = this.loadRegisteredUsers();

    const index = registeredUsers.findIndex(
      (registeredUser) => registeredUser.id === user.id,
    );

    if (index !== -1) {
      registeredUsers[index] = {
        ...registeredUsers[index],
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      localStorage.setItem(
        this.REGISTERED_USERS_KEY,
        JSON.stringify(registeredUsers),
      );
    }

    this.toastService.success(
      'Your account has been updated successfully.',
    );
  }
}

// ============================================================
// REGISTERED USER TYPE
// ============================================================

/**
 * This is used internally by AuthService.
 *
 * User remains your public user model.
 *
 * RegisteredUser additionally contains the password
 * needed for our temporary frontend authentication.
 */
interface RegisteredUser extends User {
  password: string;
}