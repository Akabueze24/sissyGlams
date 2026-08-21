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
  // FORMS
  // ============================================================

  // Personal information form
  accountForm!: FormGroup;

  // Password change form
  passwordForm!: FormGroup;

  // ============================================================
  // CURRENT USER
  // ============================================================

  currentUser: User | null = null;

  // ============================================================
  // SUBSCRIPTION
  // ============================================================

  private userSubscription!: Subscription;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    // Create both forms
    this.createAccountForm();
    this.createPasswordForm();

    // Listen for the current user
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
    this.userSubscription.unsubscribe();
  }

  // ============================================================
  // CREATE ACCOUNT FORM
  // ============================================================

  private createAccountForm(): void {
    this.accountForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // ============================================================
  // CREATE PASSWORD FORM
  // ============================================================

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

  // ============================================================
  // PASSWORD MATCH VALIDATOR
  // ============================================================

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

    const updatedUser: User = {
      id: this.currentUser!.id,
      firstName: this.accountForm.value.firstName,
      lastName: this.accountForm.value.lastName,
      email: this.accountForm.value.email,
    };

    this.authService.updateUser(updatedUser);
  }

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    // Temporary frontend-only password change.
    // The real password update will happen through the backend later.

    console.log('Password change submitted.');

    // Clear all password fields after successful submission.
    this.passwordForm.reset();
  
  }

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
