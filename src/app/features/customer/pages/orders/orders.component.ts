import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  /** All orders from storage (raw) */
  private allOrders: Order[] = [];

  /** Orders for the current user only */
  orders: Order[] = [];

  selectedOrder: Order | null = null;

  private ordersSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ordersSubscription = this.orderService.orders$.subscribe((orders) => {
      this.allOrders = orders;
      this.applyUserFilter();
    });

    // If user logs in/out while on this page, refresh the list
    this.userSubscription = this.authService.currentUser$.subscribe(() => {
      this.applyUserFilter();
    });
  }

  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  /**
   * Keep only orders whose customer email matches the logged-in user.
   * Why: OrderService stores every order in the browser; account page
   * must not show other people's mock orders.
   */
  private applyUserFilter(): void {
    const user = this.authService.getCurrentUser();
    const email = user?.email?.trim().toLowerCase();

    if (!email) {
      this.orders = [];
      this.selectedOrder = null;
      return;
    }

    this.orders = this.allOrders.filter(
      (order) => order.customer.email.trim().toLowerCase() === email
    );

    // Close detail panel if that order is no longer in the filtered list
    if (
      this.selectedOrder &&
      !this.orders.some((o) => o.id === this.selectedOrder?.id)
    ) {
      this.selectedOrder = null;
    }
  }

  toggleOrderDetails(order: Order): void {
    if (this.selectedOrder?.id === order.id) {
      this.selectedOrder = null;
    } else {
      this.selectedOrder = order;
    }
  }

  get totalCount(): number {
    return this.orders.length;
  }

  get processingCount(): number {
    return this.orders.filter(
      (o) => o.orderStatus === 'pending' || o.orderStatus === 'processing'
    ).length;
  }

  get completedCount(): number {
    return this.orders.filter(
      (o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped'
    ).length;
  }

  statusClass(status: Order['orderStatus']): string {
    if (status === 'pending' || status === 'processing') {
      return 'orders-table__status--processing';
    }
    if (status === 'delivered' || status === 'shipped') {
      return 'bg-success-subtle text-success-emphasis';
    }
    return '';
  }

  statusLabel(status: Order['orderStatus']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}