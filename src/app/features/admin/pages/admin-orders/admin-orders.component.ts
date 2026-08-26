import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})


export class AdminOrdersComponent implements OnInit, OnDestroy {

readonly statusOptions: Order['orderStatus'][] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

  orders: Order[] = [];

  searchTerm = '';
  statusFilter = '';
  paymentFilter = '';

  private ordersSubscription!: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.ordersSubscription = this.orderService.orders$.subscribe((orders) => {
      this.orders = orders;
    });
  }

  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();
  }

  /** Table uses this — filtered list */
  get filteredOrders(): Order[] {
    let result = [...this.orders];

    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      // Allow typing "#SD-123" or "SD-123"
      const normalizedTerm = term.replace(/^#/, '');

      result = result.filter((order) => {
        const id = order.id.toLowerCase();
        const name =
          `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
        const email = order.customer.email.toLowerCase();

        return (
          id.includes(normalizedTerm) ||
          name.includes(normalizedTerm) ||
          email.includes(normalizedTerm)
        );
      });
    }

    if (this.statusFilter) {
      result = result.filter(
        (order) => order.orderStatus === this.statusFilter,
      );
    }

    if (this.paymentFilter) {
      result = result.filter(
        (order) => order.paymentStatus === this.paymentFilter,
      );
    }

    return result;
  }

  onStatusChange(order: Order, status: Order['orderStatus']): void {
    this.orderService.updateOrderStatus(order.id, status);

    // Keep the open detail panel in sync
    if (this.selectedOrder?.id === order.id) {
      this.selectedOrder = {
        ...this.selectedOrder,
        orderStatus: status,
      };
    }
  }

  // Summary = all orders (not filtered)
  get totalCount(): number {
    return this.orders.length;
  }

  get pendingCount(): number {
    return this.orders.filter((o) => o.orderStatus === 'pending').length;
  }

  get processingCount(): number {
    return this.orders.filter((o) => o.orderStatus === 'processing').length;
  }

  get completedCount(): number {
    return this.orders.filter(
      (o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped',
    ).length;
  }

  customerInitials(order: Order): string {
    const first = order.customer.firstName?.charAt(0) || '';
    const last = order.customer.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }

  paymentClass(status: Order['paymentStatus']): string {
    return `admin-orders__payment--${status}`;
  }

  statusClass(status: Order['orderStatus']): string {
    return `admin-orders__status--${status}`;
  }

  label(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  selectedOrder: Order | null = null;

  viewOrder(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetail(): void {
    this.selectedOrder = null;
  }
}
