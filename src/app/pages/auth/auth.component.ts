import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Login } from 'src/app/core/models/auth-models/login.mdel';
import { Register } from 'src/app/core/models/auth-models/register.model';
import {
  AuthService,
  AuthMode,
} from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  // ============================================================
  // MODAL STATE
  // ============================================================

  isOpen = false;
  authMode: AuthMode = 'login';
  redirectUrl = '/account';

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  showPassword = false;
  showConfirmPassword = false;

  // ============================================================
  // FORMS
  // ============================================================

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  // ============================================================
  // SUBSCRIPTION
  // ============================================================

  private modalSubscription!: Subscription;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    console.log('AuthComponent: ngOnInit ran - component is alive');
    this.createLoginForm();
    this.createRegisterForm();

    // Listen for requests to open the modal (from Guard, Header, etc.)
    this.modalSubscription = this.authService.authModalRequest$.subscribe(
      (request) => {
        console.log('3. AuthComponent: received request', request);
        this.open(request.mode, request.redirectUrl || '/account');
      },
    );
  }

  ngOnDestroy(): void {
    // Always unsubscribe to avoid memory leaks
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  // ============================================================
  // FORM CREATION
  // ============================================================

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  private createRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  // ============================================================
  // LOGIN
  // ============================================================

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: Login = this.loginForm.value;

    this.authService.login(loginData);

    if (this.authService.isAuthenticated()) {
      this.close();
      this.router.navigate([this.redirectUrl]);
    }
  }

  // ============================================================
  // REGISTER
  // ============================================================

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData: Register = this.registerForm.value;

    this.authService.register(registerData);

    if (this.authService.isAuthenticated()) {
      this.close();
      this.router.navigate([this.redirectUrl]);
    }
  }

  // ============================================================
  // MODAL CONTROLS
  // ============================================================

  open(mode: AuthMode = 'login', redirectUrl: string = '/account'): void {
    this.authMode = mode;
    this.redirectUrl = redirectUrl;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  switchTo(mode: AuthMode): void {
    this.authMode = mode;
  }

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
