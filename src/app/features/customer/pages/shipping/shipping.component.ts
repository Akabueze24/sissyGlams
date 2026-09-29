import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { AddressService } from 'src/app/core/services/address-service/address.service';
import { SavedAddress } from 'src/app/core/models/user-address-model/savedAddress.model';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnInit, OnDestroy {
  shippingForm!: FormGroup;

  private userId: string | null = null;
  private userSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private addressService: AddressService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.shippingForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          // Letters only (optional space, hyphen, apostrophe) — no numbers
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
        [
          Validators.required,
          // Digits only, 10–15 characters
          Validators.pattern(/^\d{10,15}$/),
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          // Letters, numbers, space, comma, period, hyphen, #
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
        [
          Validators.required,
          // Digits only, 4–10 (strict)
          Validators.pattern(/^\d{4,10}$/),
        ],
      ],
      country: ['US', Validators.required],
    });

    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.userId = user?.id ?? null;

      if (!user) {
        return;
      }

      const saved = this.addressService.getShipping(user.id);
      if (saved) {
        this.shippingForm.patchValue(saved);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onSave(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      return;
    }

    const value = this.shippingForm.value;

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

    this.addressService.saveShipping(this.userId, address);
    this.router.navigate(['/account/address']);
  }

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
