import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Order } from '../../models/order-models/order.model';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ORDERS_KEY = 'sissy-dream-orders';
  private readonly LATEST_ORDER_KEY = 'sissy-dream-latest-order';

  private ordersSource = new BehaviorSubject<Order[]>(this.loadOrders());
  orders$ = this.ordersSource.asObservable();

  constructor(private toastService: ToastService) {}

  // ============================================================
  // SAVE
  // ============================================================

  saveOrder(order: Order): void {
    // 1) Full history (newest first)
    const orders = [order, ...this.ordersSource.value];
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.ordersSource.next(orders);

    // 2) Latest only — for confirmation page
    localStorage.setItem(this.LATEST_ORDER_KEY, JSON.stringify(order));

    this.toastService.success('Your order has been saved successfully.');
  }

  // ============================================================
  // READ
  // ============================================================

  /** Latest order (confirmation page) */
  getOrder(): Order | null {
    return this.getLatestOrder();
  }

  getLatestOrder(): Order | null {
    const raw = localStorage.getItem(this.LATEST_ORDER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Order;
    } catch {
      return null;
    }
  }

  /** All orders (account page later) */
  getOrders(): Order[] {
    return this.ordersSource.value;
  }

  getOrderById(id: string): Order | null {
    return this.ordersSource.value.find((order) => order.id === id) ?? null;
  }

  // ============================================================
  // CLEAR
  // ============================================================

  clearLatestOrder(): void {
    localStorage.removeItem(this.LATEST_ORDER_KEY);
  }

  clearAllOrders(): void {
    localStorage.removeItem(this.ORDERS_KEY);
    localStorage.removeItem(this.LATEST_ORDER_KEY);
    this.ordersSource.next([]);
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private loadOrders(): Order[] {
    const raw = localStorage.getItem(this.ORDERS_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as Order[];
    } catch {
      return [];
    }
  }

  updateOrderStatus(orderId: string, orderStatus: Order['orderStatus']): void {
    const orders = this.ordersSource.value.map((order) =>
      order.id === orderId ? { ...order, orderStatus } : order,
    );

    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.ordersSource.next(orders);

    // Keep latest in sync if this is the latest order
    const latest = this.getLatestOrder();
    if (latest?.id === orderId) {
      localStorage.setItem(
        this.LATEST_ORDER_KEY,
        JSON.stringify({ ...latest, orderStatus }),
      );
    }

    this.toastService.success(`Order status updated to ${orderStatus}.`);
  }
}
