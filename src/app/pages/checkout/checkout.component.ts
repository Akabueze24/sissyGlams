import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { CheckoutData } from 'src/app/core/models/checkout-models/checkout.model';
import { Country } from 'src/app/core/models/checkout-models/country.model';
import { ShippingQuote } from 'src/app/core/models/checkout-models/shippingQuote.model';
import { COUNTRIES } from 'src/app/core/models/checkout-models/data/country.data';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { CheckoutService } from 'src/app/core/services/checkout-service/checkout.service';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';

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
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.createCheckoutForm();
    this.prefillFromUser();

    // Align cart with stock before checkout UI
    this.cartService.syncQuantitiesWithStock();

    this.loadCart();
    this.watchCountryChanges();
    this.watchShippingChanges();
    this.watchPaymentChanges();
    this.loadShippingQuote(this.checkoutForm.get('country')?.value);
  }

  // ============================================================
  // FORM SETUP
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

  private prefillFromUser(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return;
    }

    this.checkoutForm.patchValue({
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });
  }

  // ============================================================
  // CART
  // ============================================================

  private loadCart(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;

      if (!items.length) {
        this.router.navigate(['/cart']);
        return;
      }

      this.calculateSubtotal();
      this.calculateTotal();
    });
  }

  private calculateSubtotal(): void {
    this.subtotal = this.checkoutService.calculateSubtotal(this.cartItems);
  }

  // ============================================================
  // SHIPPING
  // ============================================================

  private watchCountryChanges(): void {
    this.checkoutForm
      .get('country')
      ?.valueChanges.subscribe((countryCode: string) => {
        this.loadShippingQuote(countryCode);
        this.saveCheckoutPreferences();
      });
  }

  private loadShippingQuote(countryCode: string): void {
    this.shippingQuote = this.checkoutService.getShippingQuote(countryCode);
    this.updateShippingCost();
  }

  private watchShippingChanges(): void {
    this.checkoutForm.get('shippingMethod')?.valueChanges.subscribe(() => {
      this.updateShippingCost();
      this.saveCheckoutPreferences();
    });
  }

  private updateShippingCost(): void {
    const shippingMethod = this.checkoutForm.get('shippingMethod')?.value;

    this.shippingCost = this.checkoutService.getShippingCost(
      shippingMethod,
      this.shippingQuote
    );

    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.total = this.checkoutService.calculateTotal(
      this.subtotal,
      this.shippingCost
    );
  }

  // ============================================================
  // PREFERENCES
  // ============================================================

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
  // SUBMIT
  // ============================================================

  private getCheckoutData(): CheckoutData {
    return this.checkoutForm.value as CheckoutData;
  }

  /**
   * Place order flow:
   * 1. Validate form + shipping/total
   * 2. Sync cart to live stock
   * 3. Final stock check
   * 4. Create + save order
   * 5. Reduce stock per line
   * 6. Clear cart → confirmation
   */
  submitCheckout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.shippingCost === null || this.total === null) {
      this.toastService.info('Please select a country and shipping method.');
      return;
    }

    // Align quantities with current catalog stock
    this.cartService.syncQuantitiesWithStock();

    const items = this.cartService.getCartItems();

    if (!items.length) {
      this.toastService.info('Your cart is empty or items are out of stock.');
      this.router.navigate(['/cart']);
      return;
    }

    // Final stock check — abort if anything is short
    for (const item of items) {
      const product = this.productService.getProductById(item.product.id);
      const available = product
        ? this.productService.getAvailableStock(product)
        : 0;

      if (item.quantity > available) {
        this.toastService.info(
          `Not enough stock for "${item.product.name}". Please update your cart.`
        );
        this.router.navigate(['/cart']);
        return;
      }
    }

    const subtotal = this.checkoutService.calculateSubtotal(items);
    const total =
      this.checkoutService.calculateTotal(subtotal, this.shippingCost) ??
      this.total;

    const order = this.checkoutService.createOrder(
      this.getCheckoutData(),
      items,
      subtotal,
      this.shippingCost,
      total
    );

    // Persist order first
    this.orderService.saveOrder(order);

    // Then reduce inventory
    for (const item of items) {
      this.productService.reduceStock(item.product.id, item.quantity);
    }

    this.cartService.clearCart();
    this.router.navigate(['/order-confirmation']);
  }

  // ============================================================
  // TEMPLATE HELPERS
  // ============================================================

  get standardShipping(): number | null {
    return this.shippingQuote?.standard ?? null;
  }

  get expressShipping(): number | null {
    return this.shippingQuote?.express ?? null;
  }
}