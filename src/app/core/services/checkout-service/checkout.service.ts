import { Injectable } from '@angular/core';

import { CartItem } from '../../models/cart-models/cart.model';
import { CheckoutData } from '../../models/checkout-models/checkout.model';
import { ShippingQuote } from '../../models/checkout-models/shippingQuote.model';
import { SHIPPING_RATES } from '../../models/checkout-models/data/shipping.data';
import { CheckoutPreferences } from '../../models/checkout-models/checkout-preferences.model';
import { Order } from '../../models/order-models/order.model';

import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly CHECKOUT_STORAGE_KEY = 'sissy-dream-checkout';

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // GET SHIPPING QUOTE
  // ============================================================

  getShippingQuote(countryCode: string): ShippingQuote | null {
    const shippingRate = SHIPPING_RATES.find(
      (rate) => rate.country === countryCode,
    );

    if (!shippingRate) {
      return null;
    }

    return {
      standard: shippingRate.standard,
      express: shippingRate.express,
    };
  }

  // ============================================================
  // GET SHIPPING COST
  // ============================================================

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
  // CALCULATE SUBTOTAL
  // ============================================================

  calculateSubtotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  // ============================================================
  // CALCULATE TOTAL
  // ============================================================

  calculateTotal(subtotal: number, shippingCost: number | null): number | null {
    if (shippingCost === null) {
      return null;
    }

    return subtotal + shippingCost;
  }

  // ============================================================
  // SAVE CHECKOUT PREFERENCES
  // ============================================================

  saveCheckoutPreferences(data: CheckoutPreferences): void {
    localStorage.setItem(this.CHECKOUT_STORAGE_KEY, JSON.stringify(data));

    this.toastService.success('Your checkout preferences have been saved.');
  }

  // ============================================================
  // LOAD CHECKOUT PREFERENCES
  // ============================================================

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

  // ============================================================
  // CLEAR CHECKOUT PREFERENCES
  // ============================================================

  clearCheckoutPreferences(): void {
    localStorage.removeItem(this.CHECKOUT_STORAGE_KEY);

    this.toastService.info('Your checkout preferences have been cleared.');
  }

  // ============================================================
  // CREATE ORDER
  // ============================================================

  createOrder(
    checkoutData: CheckoutData,
    cartItems: CartItem[],
    subtotal: number,
    shippingCost: number,
    total: number,
  ): Order {
    const order: Order = {
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

    // At this stage we have only created the order object.
    // The real backend will eventually create and save
    // the order in the database.

    this.toastService.success('Your order has been prepared successfully.');

    return order;
  }

  // ============================================================
  // GENERATE ORDER ID
  // ============================================================

  private generateOrderId(): string {
    return `SD-${Date.now()}`;
  }
}
