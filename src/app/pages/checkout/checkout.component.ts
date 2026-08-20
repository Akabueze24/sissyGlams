import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CartItem } from 'src/app/core/models/cart-models/cart.model';

import { CheckoutData } from 'src/app/core/models/checkout-models/checkout.model';
import { Country } from 'src/app/core/models/checkout-models/country.model';
import { ShippingQuote } from 'src/app/core/models/checkout-models/shippingQuote.model';

import { COUNTRIES } from 'src/app/core/models/checkout-models/data/country.data';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { CheckoutService } from 'src/app/core/services/checkout-service/checkout.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  // ============================================================
  // FORM
  // ============================================================

  checkoutForm!: FormGroup;

  // ============================================================
  // COUNTRIES
  // ============================================================

  countries: Country[] = COUNTRIES;

  // ============================================================
  // CART
  // ============================================================

  cartItems: CartItem[] = [];

  subtotal = 0;

  // ============================================================
  // SHIPPING
  // ============================================================

  shippingQuote: ShippingQuote | null = null;

  shippingCost: number | null = null;

  // ============================================================
  // TOTAL
  // ============================================================

  total: number | null = null;

  // ============================================================
  // CURRENCY
  // ============================================================

  shippingCurrency = '$';

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router
  ) {}

  // ============================================================
  // INITIALIZE
  // ============================================================

  ngOnInit(): void {
    this.createCheckoutForm();

    this.loadCart();

    this.watchCountryChanges();

    this.watchShippingChanges();

    this.watchPaymentChanges();

    this.loadShippingQuote(this.checkoutForm.get('country')?.value);
  }

  // ============================================================
  // CREATE CHECKOUT FORM
  // ============================================================

  private createCheckoutForm(): void {
    const savedPreferences = this.checkoutService.getCheckoutPreferences();

    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s'-]+$/),
        ],
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s'-]+$/),
        ],
      ],

      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s()-]{10,20}$/)],
      ],

      address: ['', [Validators.required, Validators.minLength(5)]],

      apartment: [''],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s'-]+$/),
        ],
      ],

      state: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s'-]+$/),
        ],
      ],

      country: [savedPreferences?.country || '', Validators.required],

      postalCode: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{3,10}$/)],
      ],

      deliveryLocation: ['', [Validators.required, Validators.minLength(2)]],

      shippingMethod: [
        savedPreferences?.shippingMethod || '',
        Validators.required,
      ],

      paymentMethod: [
        savedPreferences?.paymentMethod || 'card',
        Validators.required,
      ],
    });
  }

  // ============================================================
  // LOAD CART
  // ============================================================

  private loadCart(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;

      this.calculateSubtotal();

      this.calculateTotal();
    });
  }

  // ============================================================
  // CALCULATE SUBTOTAL
  // ============================================================

  private calculateSubtotal(): void {
    this.subtotal = this.checkoutService.calculateSubtotal(this.cartItems);
  }

  // ============================================================
  // WATCH COUNTRY
  // ============================================================

  private watchCountryChanges(): void {
    this.checkoutForm
      .get('country')
      ?.valueChanges.subscribe((countryCode: string) => {
        this.loadShippingQuote(countryCode);

        this.saveCheckoutPreferences();
      });
  }

  // ============================================================
  // LOAD SHIPPING QUOTE
  // ============================================================

  private loadShippingQuote(countryCode: string): void {
    this.shippingQuote = this.checkoutService.getShippingQuote(countryCode);

    this.updateShippingCost();
  }

  // ============================================================
  // WATCH SHIPPING METHOD
  // ============================================================

  private watchShippingChanges(): void {
    this.checkoutForm.get('shippingMethod')?.valueChanges.subscribe(() => {
      this.updateShippingCost();

      this.saveCheckoutPreferences();
    });
  }

  // ============================================================
  // UPDATE SHIPPING COST
  // ============================================================

  private updateShippingCost(): void {
    const shippingMethod = this.checkoutForm.get('shippingMethod')?.value;

    this.shippingCost = this.checkoutService.getShippingCost(
      shippingMethod,
      this.shippingQuote,
    );

    this.calculateTotal();
  }

  // ============================================================
  // CALCULATE TOTAL
  // ============================================================

  private calculateTotal(): void {
    this.total = this.checkoutService.calculateTotal(
      this.subtotal,
      this.shippingCost,
    );
  }

  // ============================================================
  // CHECKOUT DATA
  // ============================================================

  private getCheckoutData(): CheckoutData {
    return this.checkoutForm.value as CheckoutData;
  }

  // ============================================================
  // SUBMIT CHECKOUT
  // ============================================================

submitCheckout(): void {
  if (this.checkoutForm.invalid) {
    this.checkoutForm.markAllAsTouched();
    return;
  }

  if (this.shippingCost === null || this.total === null) {
    return;
  }

  const checkoutData = this.getCheckoutData();

  const order = this.checkoutService.createOrder(
    checkoutData,
    this.cartItems,
    this.subtotal,
    this.shippingCost,
    this.total,
  );

  this.orderService.saveOrder(order);
  this.cartService.clearCart()
  console.log('Order created:', order);

  this.router.navigate(['/order-confirmation'])

  
}

  private watchPaymentChanges(): void {
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(() => {
      this.saveCheckoutPreferences();
    });
  }

  private saveCheckoutPreferences(): void {
    this.checkoutService.saveCheckoutPreferences({
      country: this.checkoutForm.get('country')?.value || '',
      shippingMethod: this.checkoutForm.get('shippingMethod')?.value || '',
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value || '',
    });
  }

  // ============================================================
  // SHIPPING DISPLAY VALUES
  // ============================================================

  get standardShipping(): number | null {
    return this.shippingQuote?.standard ?? null;
  }

  get expressShipping(): number | null {
    return this.shippingQuote?.express ?? null;
  }
}
