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
import { SettingsService } from 'src/app/core/services/store-settings/store-settings.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';
import { AddressService } from 'src/app/core/services/address-service/address.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  countries: Country[] = COUNTRIES;

  cartItems: CartItem[] = [];
  subtotal = 0;

  shippingQuote: ShippingQuote | null = null;
  shippingCost: number | null = null;
  total: number | null = null;

  /** On-page message when store is closed */
  pageBlockMessage = '';

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
    private router: Router
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

    // Guest rule is independent of store-active (not else-if)
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

  // Always prefill account identity
  this.checkoutForm.patchValue({
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
  });

  // Then overlay saved shipping address (if any)
  const shipping = this.addressService.getShipping(user.id);

  if (shipping) {
    this.checkoutForm.patchValue({
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      phone: shipping.phone,
      address: shipping.address,
      apartment: shipping.apartment || '',
      city: shipping.city,
      state: shipping.state,
      postalCode: shipping.postalCode,
      country: shipping.country,
    });
  }
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

  submitCheckout(): void {
    const settings = this.settingsService.getSettings();

    if (!settings.storeActive) {
      this.toastService.info(
        'The store is temporarily closed. Your order was not placed.'
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

    this.orderService.saveOrder(order);

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