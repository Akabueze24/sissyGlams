import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartItem } from '../../models/cart-models/cart.model';
import { CheckoutData } from '../../models/checkout-models/checkout.model';
import { ShippingQuote } from '../../models/checkout-models/shippingQuote.model';
import { CheckoutPreferences } from '../../models/checkout-models/checkout-preferences.model';
import { Order } from '../../models/order-models/order.model';
import { ShippingRate } from '../../models/checkout-models/shipping-rate.model';

import { ToastService } from '../toast-service/toast.service';
import { ShippingService } from '../shipping-service/shipping.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly CHECKOUT_STORAGE_KEY = 'sissy-dream-checkout';

  constructor(
    private toastService: ToastService,
    private shippingService: ShippingService,
  ) {}

  // ============================================================
  // SHIPPING (API)
  // ============================================================

  /**
   * Active destinations for the country dropdown.
   * Source: GET /api/shipping/rates
   */
  getShippingDestinations(): Observable<ShippingRate[]> {
    return this.shippingService.getRates();
  }

  /**
   * Standard / express prices for one country.
   * Source: GET /api/shipping/quote/:countryCode
   */
  getShippingQuote(countryCode: string): Observable<ShippingQuote | null> {
    if (!countryCode?.trim()) {
      return of(null);
    }

    return this.shippingService.getQuote(countryCode).pipe(
      map((quote) => {
        if (!quote) {
          return null;
        }

        return {
          standard: quote.standard,
          express: quote.express,
        };
      }),
    );
  }

  getShippingCost(
    shippingMethod: 'standard' | 'express' | '',
    shippingQuote: ShippingQuote | null,
  ): number | null {
    if (!shippingQuote || !shippingMethod) {
      return null;
    }

    if (shippingMethod === 'standard') {
      return shippingQuote.standard;
    }

    if (shippingMethod === 'express') {
      return shippingQuote.express;
    }

    return null;
  }

  // ============================================================
  // CART MATH (unchanged)
  // ============================================================

  calculateSubtotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  calculateTotal(subtotal: number, shippingCost: number | null): number | null {
    if (shippingCost === null) {
      return null;
    }

    return subtotal + shippingCost;
  }

  // ============================================================
  // PREFERENCES (unchanged)
  // ============================================================

  saveCheckoutPreferences(data: CheckoutPreferences): void {
    localStorage.setItem(this.CHECKOUT_STORAGE_KEY, JSON.stringify(data));
    this.toastService.success('Your checkout preferences have been saved.');
  }

  getCheckoutPreferences(): CheckoutPreferences | null {
    const savedData = localStorage.getItem(this.CHECKOUT_STORAGE_KEY);

    if (!savedData) {
      return null;
    }

    try {
      return JSON.parse(savedData) as CheckoutPreferences;
    } catch {
      return null;
    }
  }

  clearCheckoutPreferences(): void {
    localStorage.removeItem(this.CHECKOUT_STORAGE_KEY);
    this.toastService.info('Your checkout preferences have been cleared.');
  }

  // ============================================================
  // CREATE ORDER (unchanged)
  // ============================================================

  createOrder(
    checkoutData: CheckoutData,
    cartItems: CartItem[],
    subtotal: number,
    shippingCost: number,
    total: number,
  ): Order {
    return {
      id: this.generateOrderId(),

      customer: {
        email: checkoutData.email,
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        phone: checkoutData.phone,
      },

      shippingAddress: {
        address: checkoutData.address,
        apartment: checkoutData.apartment,
        city: checkoutData.city,
        state: checkoutData.state,
        country: checkoutData.country,
        postalCode: checkoutData.postalCode,
        deliveryLocation: checkoutData.deliveryLocation,
      },

      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        length: item.length,
      })),

      subtotal,
      shippingCost,
      total,
      shippingMethod: checkoutData.shippingMethod,
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  private generateOrderId(): string {
    return `SD-${Date.now()}`;
  }
}