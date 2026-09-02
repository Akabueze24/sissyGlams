import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Order } from '../../models/order-models/order.model';
import { ToastService } from '../toast-service/toast.service';
import { ProductService } from '../product-service/product.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ORDERS_KEY = 'sissy-dream-orders';
  private readonly LATEST_ORDER_KEY = 'sissy-dream-latest-order';

  private ordersSource = new BehaviorSubject<Order[]>(this.loadOrders());
  orders$ = this.ordersSource.asObservable();

  constructor(
    private toastService: ToastService,
    private productService: ProductService
  ) {}

  // ============================================================
  // SAVE
  // ============================================================

  saveOrder(order: Order): void {
    const orders = [order, ...this.ordersSource.value];
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.ordersSource.next(orders);

    localStorage.setItem(this.LATEST_ORDER_KEY, JSON.stringify(order));

    this.toastService.success('Your order has been saved successfully.');
  }

  // ============================================================
  // READ
  // ============================================================

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

  getOrders(): Order[] {
    return this.ordersSource.value;
  }

  getOrderById(id: string): Order | null {
    return this.ordersSource.value.find((order) => order.id === id) ?? null;
  }

  getOrdersByEmail(email: string): Order[] {
    const normalized = email.trim().toLowerCase();
    return this.ordersSource.value.filter(
      (order) =>
        (order.customer?.email ?? '').trim().toLowerCase() === normalized
    );
  }

  // ============================================================
  // STATUS
  // ============================================================

  /**
   * Update order status.
   * When status becomes "cancelled" for the first time, restore stock
   * for every line on the order.
   */
  updateOrderStatus(orderId: string, orderStatus: Order['orderStatus']): void {
    const current = this.ordersSource.value.find((o) => o.id === orderId);

    if (!current) {
      return;
    }

    const previousStatus = current.orderStatus;

    const orders = this.ordersSource.value.map((order) =>
      order.id === orderId ? { ...order, orderStatus } : order
    );

    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.ordersSource.next(orders);

    const latest = this.getLatestOrder();
    if (latest?.id === orderId) {
      localStorage.setItem(
        this.LATEST_ORDER_KEY,
        JSON.stringify({ ...latest, orderStatus })
      );
    }

    // Only restore when entering cancelled (not if already cancelled)
    if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
      this.restoreStockForOrder(current);
    }

    this.toastService.success(`Order status updated to ${orderStatus}.`);
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

  private restoreStockForOrder(order: Order): void {
    for (const item of order.items) {
      this.productService.restoreStock(item.productId, item.quantity);
    }
  }
}