import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Login } from '../../models/auth-models/login.mdel';
import { Register } from '../../models/auth-models/register.model';
import { User } from '../../models/auth-models/user.model';

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
  }

  // ============================================================
  // LOGIN
  // ============================================================

  login(loginData: Login): void {
    // Temporary implementation.
    // Real authentication will happen through the backend later.

    const savedUser = this.loadUser();

    if (!savedUser) {
      return;
    }

    this.currentUserSubject.next(savedUser);
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {
    localStorage.removeItem('sissy-dream-user');

    this.currentUserSubject.next(null);
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
}
