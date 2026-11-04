import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { User } from 'src/app/core/models/auth-models/user.model';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // ============================================================
  // OTP MODAL
  // ============================================================

  otpOpen = false;
  otpError = '';
  otpVerifying = false;
  otpResendSeconds = 0;
  private requestingCode = false;

  // ============================================================
  // FORMS
  // ============================================================

  accountForm!: FormGroup;
  passwordForm!: FormGroup;

  // ============================================================
  // CURRENT USER
  // ============================================================

  currentUser: User | null = null;

  private userSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.createAccountForm();
    this.createPasswordForm();

    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      if (user) {
        this.accountForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  // ============================================================
  // FORMS
  // ============================================================

  private createAccountForm(): void {
    this.accountForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private createPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // ============================================================
  // SAVE ACCOUNT
  // ============================================================

  onSaveAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser) {
      return;
    }

    this.authService
      .updateProfile({
        firstName: this.accountForm.value.firstName,
        lastName: this.accountForm.value.lastName,
        email: this.accountForm.value.email,
      })
      .subscribe();
  }

  // ============================================================
  // CHANGE PASSWORD → validate → send code → open OTP modal
  // ============================================================

  /**
   * Submit "Change Password":
   * 1. Validate form
   * 2. Request email code
   * 3. Open OTP modal (user enters code there)
   */
  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.requestPasswordCodeAndOpenModal();
  }

  /** Resend from inside the OTP modal */
  onRequestPasswordCode(): void {
    this.requestPasswordCodeAndOpenModal();
  }

  private requestPasswordCodeAndOpenModal(): void {
    if (this.requestingCode) {
      return;
    }

    this.requestingCode = true;
    this.otpError = '';

    this.authService.requestPasswordChangeCode().subscribe((ok) => {
      this.requestingCode = false;

      if (ok) {
        this.otpOpen = true;
        // New reference so ngOnChanges restarts the timer
        this.otpResendSeconds = 0;
        setTimeout(() => {
          this.otpResendSeconds = 60;
        }, 0);
      }
    });
  }

  /**
   * OTP modal emitted a 6-digit code → confirm with backend.
   */
  onOtpVerified(code: string): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.otpVerifying = true;
    this.otpError = '';

    this.authService
      .confirmPasswordChange(currentPassword, code, newPassword)
      .subscribe((ok) => {
        this.otpVerifying = false;

        if (ok) {
          this.otpOpen = false;
          this.otpResendSeconds = 0;
          this.passwordForm.reset();
        } else {
          // Toast already shown in AuthService; also show on modal
          this.otpError = 'Invalid or expired confirmation code.';
        }
      });
  }

  onOtpClosed(): void {
    this.otpOpen = false;
    this.otpError = '';
    this.otpVerifying = false;
  }

  // ============================================================
  // PASSWORD VISIBILITY TOGGLES
  // ============================================================

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}