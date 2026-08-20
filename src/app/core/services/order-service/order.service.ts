import { Injectable } from '@angular/core';

import { Order } from '../../models/order-models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ORDER_STORAGE_KEY = 'sissy-dream-latest-order';

  // ============================================================
  // SAVE ORDER
  // ============================================================

  saveOrder(order: Order): void {
    localStorage.setItem(
      this.ORDER_STORAGE_KEY,
      JSON.stringify(order),
    );
  }

  // ============================================================
  // GET ORDER
  // ============================================================

  getOrder(): Order | null {
    const savedOrder = localStorage.getItem(
      this.ORDER_STORAGE_KEY,
    );

    if (!savedOrder) {
      return null;
    }

    try {
      return JSON.parse(savedOrder) as Order;
    } catch {
      return null;
    }
  }

  // ============================================================
  // CLEAR ORDER
  // ============================================================

  clearOrder(): void {
    localStorage.removeItem(this.ORDER_STORAGE_KEY);
  }
}