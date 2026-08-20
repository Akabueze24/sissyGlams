import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Login } from 'src/app/core/models/auth-models/login.mdel';
import { Register } from 'src/app/core/models/auth-models/register.model';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  // ============================================================
  // MODAL
  // ============================================================

  isOpen = false;

  authMode: AuthMode = 'login';

  // Where the user should go after login or registration
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
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  // ============================================================
  // INITIALIZE
  // ============================================================

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();
  }

  // ============================================================
  // CREATE LOGIN FORM
  // ============================================================

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]],

      rememberMe: [false],
    });
  }

  // ============================================================
  // CREATE REGISTER FORM
  // ============================================================

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

    // Only redirect if authentication was successful
    if (this.authService.isAuthenticated()) {
      this.close();

      this.router.navigate([this.redirectUrl]);
    }

    console.log('Login data:', loginData);
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

    // Registration automatically authenticates the new user
    if (this.authService.isAuthenticated()) {
      this.close();

      this.router.navigate([this.redirectUrl]);
    }

    console.log('Register data:', registerData);
  }

  // ============================================================
  // OPEN MODAL
  // ============================================================

  open(
    mode: AuthMode = 'login',
    redirectUrl: string = '/account'
  ): void {
    this.authMode = mode;

    // Remember where the user wanted to go
    this.redirectUrl = redirectUrl;

    this.isOpen = true;
  }

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  close(): void {
    this.isOpen = false;
  }

  // ============================================================
  // SWITCH BETWEEN LOGIN AND REGISTER
  // ============================================================

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