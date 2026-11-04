import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Login } from 'src/app/core/models/auth-models/login.mdel';
import { Register } from 'src/app/core/models/auth-models/register.model';
import {
  AuthService,
  AuthMode,
} from 'src/app/core/services/auth-service/auth.service';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';

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
  // EMAIL OTP (after register — before any session)
  // ============================================================

  otpOpen = false;
  otpError = '';
  otpVerifying = false;
  otpResendSeconds = 0;

  /** Email waiting for OTP — required for public verify/resend */
  pendingVerifyEmail = '';

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

  private modalSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();

    this.modalSubscription = this.authService.authModalRequest$.subscribe(
      (request) => {
        this.open(request.mode, request.redirectUrl || '/account');
      },
    );
  }

  ngOnDestroy(): void {
    this.modalSubscription?.unsubscribe();
  }

  // ============================================================
  // FORMS
  // ============================================================

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  private createRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        termsAccepted: [false, Validators.requiredTrue],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  // ============================================================
  // LOGIN
  // Backend returns 403 if email is not verified — no OTP here
  // ============================================================

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: Login = this.loginForm.value;

    this.authService.login(loginData).subscribe((res) => {
      if (!res) {
        return;
      }

      // Unverified — open OTP, no session
      if ('needsVerification' in res && res.needsVerification) {
        this.pendingVerifyEmail = res.email;
        this.isOpen = false;
        this.openEmailOtpModal();
        this.authService.resendEmailVerification(res.email).subscribe();
        return;
      }

      // Normal verified login
      this.wishlistService.syncAfterLogin();
      this.cartService.syncAfterLogin();
      this.finishAuthSuccess();
    });
  }
  // ============================================================
  // REGISTER
  // No session yet — only open OTP
  // ============================================================

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData: Register = this.registerForm.value;

    this.authService.register(registerData).subscribe((res) => {
      if (!res) {
        return;
      }

      this.pendingVerifyEmail = res.email;
      this.isOpen = false;
      this.openEmailOtpModal();
    });
  }
  // ============================================================
  // EMAIL OTP
  // ============================================================

  private openEmailOtpModal(): void {
    this.otpError = '';
    this.otpVerifying = false;
    this.otpOpen = true;
    this.otpResendSeconds = 0;
    setTimeout(() => {
      this.otpResendSeconds = 60;
    }, 0);
  }

  onOtpVerified(code: string): void {
    if (!this.pendingVerifyEmail) {
      this.otpError = 'Missing email. Please try again.';
      return;
    }

    this.otpVerifying = true;
    this.otpError = '';

    this.authService
      .verifyEmail(this.pendingVerifyEmail, code)
      .subscribe((user) => {
        this.otpVerifying = false;
        if (!user) {
          this.otpError = 'Invalid or expired verification code.';
          return;
        }

        this.otpOpen = false;
        this.pendingVerifyEmail = '';
        this.registerForm.reset();
        this.wishlistService.syncAfterLogin();
        this.cartService.syncAfterLogin();
        this.finishAuthSuccess();
      });
  }
  onOtpResend(): void {
    if (!this.pendingVerifyEmail) {
      return;
    }
    this.authService
      .resendEmailVerification(this.pendingVerifyEmail)
      .subscribe((ok) => {
        if (!ok) return;
        this.otpError = '';
        this.otpResendSeconds = 0;
        setTimeout(() => (this.otpResendSeconds = 60), 0);
      });
  }
  onOtpClosed(): void {
    this.otpOpen = false;
    this.otpError = '';
    this.otpVerifying = false;
    this.pendingVerifyEmail = '';
    // stay logged out — no finishAuthSuccess()
  }

  private finishAuthSuccess(): void {
    this.close();
    this.router.navigate([this.redirectUrl]);
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

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
