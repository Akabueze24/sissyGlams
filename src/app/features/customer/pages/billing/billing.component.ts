import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AddressService } from 'src/app/core/services/address-service/address.service';
import { SavedAddress } from 'src/app/core/models/user-address-model/savedAddress.model';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit, OnDestroy {
  billingForm!: FormGroup;
  isSaving = false;

  private loadSub?: Subscription;
  private saveSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/),
        ],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\d{10,15}$/)],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\s,.\-#/]+$/),
        ],
      ],
      apartment: [
        '',
        [
          Validators.maxLength(40),
          Validators.pattern(/^[A-Za-z0-9\s,.\-#/]*$/),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/),
        ],
      ],
      state: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/),
        ],
      ],
      postalCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{4,10}$/)],
      ],
      country: ['US', Validators.required],
    });

    this.loadSub = this.addressService.getMyAddresses().subscribe({
      next: (data) => {
        if (data.billing) {
          this.billingForm.patchValue(data.billing);
        }
      },
      error: (err) => {
        const message =
          err?.error?.message || 'Could not load billing address.';
        this.toastService.error(message);
      },
    });
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }

  // ============================================================
  // SAVE
  // ============================================================

  onSave(): void {
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      return;
    }

    if (this.isSaving) {
      return;
    }

    const value = this.billingForm.value;

    const address: SavedAddress = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      phone: value.phone.trim(),
      address: value.address.trim(),
      apartment: value.apartment?.trim() || undefined,
      city: value.city.trim(),
      state: value.state.trim(),
      postalCode: value.postalCode.trim(),
      country: value.country,
    };

    this.isSaving = true;

    this.saveSub = this.addressService.saveBilling(address).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/account/address']);
      },
      error: (err) => {
        this.isSaving = false;
        const message =
          err?.error?.message || 'Could not save billing address.';
        this.toastService.error(message);
      },
    });
  }

  // ============================================================
  // INPUT HELPERS
  // ============================================================

  allowDigitsOnly(event: KeyboardEvent): void {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowNameChar(event: KeyboardEvent): void {
    if (!/^[A-Za-z '\-]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}