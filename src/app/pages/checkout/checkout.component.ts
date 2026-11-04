import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { CheckoutData } from 'src/app/core/models/checkout-models/checkout.model';
import { ShippingQuote } from 'src/app/core/models/checkout-models/shippingQuote.model';
import { ShippingRate } from 'src/app/core/models/checkout-models/shipping-rate.model';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { CheckoutService } from 'src/app/core/services/checkout-service/checkout.service';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { SettingsService } from 'src/app/core/services/store-settings/store-settings.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';
import { AddressService } from 'src/app/core/services/address-service/address.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;

  /** Active destinations from API (country dropdown) */
  shippingRates: ShippingRate[] = [];

  cartItems: CartItem[] = [];
  subtotal = 0;

  shippingQuote: ShippingQuote | null = null;
  shippingCost: number | null = null;
  total: number | null = null;

  pageBlockMessage = '';

  private quoteSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private toastService: ToastService,
    private addressService: AddressService,
    private router: Router,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    const settings = this.settingsService.getSettings();

    if (!settings.storeActive) {
      this.pageBlockMessage =
        'Checkout is unavailable right now. The store is temporarily closed.';
    }

    if (
      settings.guestCheckout !== true &&
      !this.authService.isAuthenticated()
    ) {
      this.authService.openAuthModal('login', '/checkout');
      this.router.navigate(['/cart']);
      return;
    }

    this.createCheckoutForm();
    this.prefillFromUser();

    this.cartService.syncQuantitiesWithStock();

    this.loadCart();
    this.loadShippingDestinations();
    this.watchCountryChanges();
    this.watchShippingChanges();
    this.watchPaymentChanges();

    const initialCountry = this.checkoutForm.get('country')?.value;
    if (initialCountry) {
      this.loadShippingQuote(initialCountry);
    }
  }

  ngOnDestroy(): void {
    this.quoteSubscription?.unsubscribe();
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

    this.addressService.getMyAddresses().subscribe({
      next: (data) => {
        if (!data.shipping) {
          return;
        }

        const s = data.shipping;

        this.checkoutForm.patchValue({
          firstName: s.firstName,
          lastName: s.lastName,
          phone: s.phone,
          address: s.address,
          apartment: s.apartment || '',
          city: s.city,
          state: s.state,
          postalCode: s.postalCode,
          country: s.country,
        });

        if (s.country) {
          this.loadShippingQuote(s.country);
        }
      },
      error: () => {
        // Guest / network — identity-only prefill
      },
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
  // SHIPPING (API)
  // ============================================================

  private loadShippingDestinations(): void {
    this.checkoutService.getShippingDestinations().subscribe((rates) => {
      this.shippingRates = rates;

      // If saved country is no longer offered, clear quote
      const current = this.checkoutForm.get('country')?.value;
      if (
        current &&
        !rates.some((r) => r.countryCode === current)
      ) {
        this.shippingQuote = null;
        this.updateShippingCost();
      }
    });
  }

  private watchCountryChanges(): void {
    this.checkoutForm
      .get('country')
      ?.valueChanges.subscribe((countryCode: string) => {
        this.loadShippingQuote(countryCode);
        this.saveCheckoutPreferences();
      });
  }

  private loadShippingQuote(countryCode: string): void {
    this.quoteSubscription?.unsubscribe();

    if (!countryCode?.trim()) {
      this.shippingQuote = null;
      this.updateShippingCost();
      return;
    }

    this.quoteSubscription = this.checkoutService
      .getShippingQuote(countryCode)
      .subscribe((quote) => {
        this.shippingQuote = quote;
        this.updateShippingCost();
      });
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
      this.shippingQuote,
    );

    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.total = this.checkoutService.calculateTotal(
      this.subtotal,
      this.shippingCost,
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

  submitCheckout(): void {
    const settings = this.settingsService.getSettings();

    if (!settings.storeActive) {
      this.toastService.info(
        'The store is temporarily closed. Your order was not placed.',
      );
      return;
    }

    if (
      settings.guestCheckout !== true &&
      !this.authService.isAuthenticated()
    ) {
      this.authService.openAuthModal('login', '/checkout');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.shippingCost === null || this.total === null) {
      this.toastService.info('Please select a country and shipping method.');
      return;
    }

    this.cartService.syncQuantitiesWithStock();

    const items = this.cartService.getCartItems();

    if (!items.length) {
      this.toastService.info('Your cart is empty or items are out of stock.');
      this.router.navigate(['/cart']);
      return;
    }

    for (const item of items) {
      const product = this.productService.getProductById(item.product.id);
      const available = product
        ? this.productService.getAvailableStock(product)
        : 0;

      if (item.quantity > available) {
        this.toastService.info(
          `Not enough stock for "${item.product.name}". Please update your cart.`,
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
      total,
    );

    this.orderService.saveOrder(order).subscribe((saved) => {
      if (!saved) {
        return;
      }

      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation']);
    });
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