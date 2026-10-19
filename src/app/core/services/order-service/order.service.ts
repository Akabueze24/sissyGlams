import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Order } from '../../models/order-models/order.model';
import { ToastService } from '../toast-service/toast.service';
import { ProductService } from '../product-service/product.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly LATEST_ORDER_KEY = 'sissy-dream-latest-order';

  private ordersSource = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSource.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private productService: ProductService,
  ) {}

  // ============================================================
  // MAPPING
  // ============================================================

  private mapApiOrder(raw: any): Order {
    return {
      id: raw._id ?? raw.id,
      customer: raw.customer,
      shippingAddress: raw.shippingAddress,
      items: raw.items ?? [],
      subtotal: raw.subtotal,
      shippingCost: raw.shippingCost,
      total: raw.total,
      shippingMethod: raw.shippingMethod,
      paymentMethod: raw.paymentMethod,
      paymentStatus: raw.paymentStatus,
      orderStatus: raw.orderStatus,
      createdAt: raw.createdAt,
    };
  }

  // ============================================================
  // LOAD
  // ============================================================

  /**
   * Full order list from the API (admin).
   * Call from AdminOrdersComponent.ngOnInit — not from the constructor.
   */
  refreshOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/orders`).pipe(
      map((list) => (list ?? []).map((o) => this.mapApiOrder(o))),
      tap((orders) => this.ordersSource.next(orders)),
      catchError((err) => {
        console.error('Failed to load orders', err);
        this.toastService.error(
          err?.error?.message || 'Could not load orders.',
        );
        return of(this.ordersSource.value);
      }),
    );
  }

  /**
   * Orders for one email (account page). Does not replace admin list.
   */
  loadOrdersByEmail(email: string): Observable<Order[]> {
    const q = encodeURIComponent(email.trim().toLowerCase());

    return this.http
      .get<any[]>(`${environment.apiUrl}/orders?email=${q}`)
      .pipe(
        map((list) => (list ?? []).map((o) => this.mapApiOrder(o))),
        catchError((err) => {
          console.error('Failed to load orders by email', err);
          return of([]);
        }),
      );
  }

  // ============================================================
  // CREATE (checkout)
  // ============================================================

  /**
   * POST /orders — server decreases stock.
   * On success: update list, latest order, refresh products.
   * On failure: toast (e.g. 400 not enough stock) and return null.
   */
  saveOrder(order: Order): Observable<Order | null> {
    const { id, ...payload } = order;

    return this.http.post<any>(`${environment.apiUrl}/orders`, payload).pipe(
      map((raw) => this.mapApiOrder(raw)),
      tap((saved) => {
        this.ordersSource.next([saved, ...this.ordersSource.value]);
        localStorage.setItem(this.LATEST_ORDER_KEY, JSON.stringify(saved));
        this.toastService.success('Your order has been saved successfully.');
        this.productService.loadProductsFromApi();
      }),
      catchError((err) => {
        console.error('Failed to save order', err);

        const msg =
          err?.error?.message ||
          (err?.status === 400
            ? 'Could not place order. Check stock and try again.'
            : 'Could not save order. Please try again.');

        this.toastService.error(msg);
        return of(null);
      }),
    );
  }

  // ============================================================
  // READ (sync helpers)
  // ============================================================

  getOrder(): Order | null {
    return this.getLatestOrder();
  }

  getLatestOrder(): Order | null {
    const raw = localStorage.getItem(this.LATEST_ORDER_KEY);
    if (!raw) {
      return null;
    }

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
        (order.customer?.email ?? '').trim().toLowerCase() === normalized,
    );
  }

  // ============================================================
  // STATUS (admin)
  // ============================================================

  /**
   * PUT order status. Server restores stock when status becomes cancelled.
   */
  updateOrderStatus(
    orderId: string,
    orderStatus: Order['orderStatus'],
  ): void {
    const current = this.ordersSource.value.find((o) => o.id === orderId);
    if (!current) {
      return;
    }

    const previousStatus = current.orderStatus;

    this.http
      .put<any>(`${environment.apiUrl}/orders/id/${orderId}`, { orderStatus })
      .pipe(
        map((raw) => this.mapApiOrder(raw)),
        catchError((err) => {
          console.error('Failed to update order status', err);
          this.toastService.error(
            err?.error?.message || 'Could not update order status.',
          );
          return of(null);
        }),
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }

        this.ordersSource.next(
          this.ordersSource.value.map((order) =>
            order.id === orderId ? updated : order,
          ),
        );

        const latest = this.getLatestOrder();
        if (latest?.id === orderId) {
          localStorage.setItem(
            this.LATEST_ORDER_KEY,
            JSON.stringify({
              ...latest,
              orderStatus: updated.orderStatus,
            }),
          );
        }

        if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
          this.productService.loadProductsFromApi();
        }

        this.toastService.success(
          `Order status updated to ${orderStatus}.`,
        );
      });
  }

  // ============================================================
  // CLEAR
  // ============================================================

  clearLatestOrder(): void {
    localStorage.removeItem(this.LATEST_ORDER_KEY);
  }

  /** Local UI only — does not delete orders on the server */
  clearAllOrders(): void {
    localStorage.removeItem(this.LATEST_ORDER_KEY);
    this.ordersSource.next([]);
  }
}