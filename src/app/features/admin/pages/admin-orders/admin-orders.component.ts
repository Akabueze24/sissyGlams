import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  // ============================================================
  // ORDER STATUS OPTIONS
  // ============================================================

  readonly statusOptions: Order['orderStatus'][] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // ============================================================
  // ORDERS
  // ============================================================

  orders: Order[] = [];

  filteredOrders: Order[] = [];

  // ============================================================
  // FILTERS
  // ============================================================

  searchTerm = '';
  statusFilter = '';
  paymentFilter = '';

  // ============================================================
  // SELECTED ORDER
  // ============================================================

  selectedOrder: Order | null = null;

  // ============================================================
  // SUBSCRIPTION
  // ============================================================

  private ordersSubscription!: Subscription;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private orderService: OrderService) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.ordersSubscription = this.orderService.orders$.subscribe((orders) => {
      this.orders = orders;

      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();

    // Restore page scrolling if the component is destroyed
    // while the order modal is open.
    document.body.style.overflow = '';
  }

  // ============================================================
  // FILTER ORDERS
  // ============================================================

  applyFilters(): void {
    let result = [...this.orders];

    const term = this.searchTerm.trim().toLowerCase();

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    if (term) {
      // Allows:
      // #SD-123
      // SD-123
      // customer name
      // customer email

      const normalizedTerm = term.replace(/^#/, '');

      result = result.filter((order) => {
        const id = order.id?.toLowerCase() || '';

        const name =
          `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();

        const email = order.customer.email?.toLowerCase() || '';

        return (
          id.includes(normalizedTerm) ||
          name.includes(normalizedTerm) ||
          email.includes(normalizedTerm)
        );
      });
    }

    // ----------------------------------------------------------
    // ORDER STATUS FILTER
    // ----------------------------------------------------------

    if (this.statusFilter) {
      result = result.filter(
        (order) => order.orderStatus === this.statusFilter,
      );
    }

    // ----------------------------------------------------------
    // PAYMENT FILTER
    // ----------------------------------------------------------

    if (this.paymentFilter) {
      result = result.filter(
        (order) => order.paymentStatus === this.paymentFilter,
      );
    }

    this.filteredOrders = result;
  }

  // ============================================================
  // ORDER STATUS UPDATE
  // ============================================================

  onStatusChange(order: Order, status: Order['orderStatus']): void {
    this.orderService.updateOrderStatus(order.id, status);

    // Keep the open modal in sync.
    if (this.selectedOrder?.id === order.id) {
      this.selectedOrder = {
        ...this.selectedOrder,
        orderStatus: status,
      };
    }
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  get totalCount(): number {
    return this.orders.length;
  }

  get pendingCount(): number {
    return this.orders.filter((order) => order.orderStatus === 'pending')
      .length;
  }

  get processingCount(): number {
    return this.orders.filter((order) => order.orderStatus === 'processing')
      .length;
  }

  get completedCount(): number {
    return this.orders.filter(
      (order) =>
        order.orderStatus === 'delivered' || order.orderStatus === 'shipped',
    ).length;
  }

  // ============================================================
  // CUSTOMER INITIALS
  // ============================================================

  customerInitials(order: Order): string {
    const first = order.customer.firstName?.charAt(0) || '';

    const last = order.customer.lastName?.charAt(0) || '';

    return (first + last).toUpperCase() || '?';
  }

  // ============================================================
  // PAYMENT CLASS
  // ============================================================

  paymentClass(status: Order['paymentStatus']): string {
    return `admin-orders__payment--${status}`;
  }

  // ============================================================
  // ORDER STATUS CLASS
  // ============================================================

  statusClass(status: Order['orderStatus']): string {
    return `admin-orders__status--${status}`;
  }

  // ============================================================
  // LABEL
  // ============================================================

  label(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // ============================================================
  // OPEN ORDER MODAL
  // ============================================================

  viewOrder(order: Order): void {
    this.selectedOrder = order;

    // Prevent the page behind the modal from scrolling.
    document.body.style.overflow = 'hidden';
  }

  // ============================================================
  // CLOSE ORDER MODAL
  // ============================================================

  closeOrderDetail(): void {
    this.selectedOrder = null;

    // Restore normal page scrolling.
    document.body.style.overflow = '';
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
