import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { PaginationService } from 'src/app/core/services/pagination-service/pagination.service';

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
  // PAGINATION (Option A — local state + shared helpers)
  // ============================================================

  currentPage = 1;
  pageSize = 10;

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

  constructor(
    private orderService: OrderService,
    private pagination: PaginationService
  ) {}

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
    document.body.style.overflow = '';
  }

  // ============================================================
  // FILTER ORDERS
  // ============================================================

  /** Call from template when search / status / payment changes */
  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.orders];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
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

    if (this.statusFilter) {
      result = result.filter(
        (order) => order.orderStatus === this.statusFilter
      );
    }

    if (this.paymentFilter) {
      result = result.filter(
        (order) => order.paymentStatus === this.paymentFilter
      );
    }

    this.filteredOrders = result;

    this.currentPage = this.pagination.clampPage(
      this.currentPage,
      this.filteredOrders.length,
      this.pageSize
    );
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  get pagedOrders(): Order[] {
    return this.pagination.slicePage(
      this.filteredOrders,
      this.currentPage,
      this.pageSize
    );
  }

  get pageRangeStart(): number {
    return this.pagination.rangeStart(
      this.currentPage,
      this.pageSize,
      this.filteredOrders.length
    );
  }

  get pageRangeEnd(): number {
    return this.pagination.rangeEnd(
      this.currentPage,
      this.pageSize,
      this.filteredOrders.length
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ============================================================
  // ORDER STATUS UPDATE
  // ============================================================

  onStatusChange(order: Order, status: Order['orderStatus']): void {
    this.orderService.updateOrderStatus(order.id, status);

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
        order.orderStatus === 'delivered' || order.orderStatus === 'shipped'
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
  // OPEN / CLOSE ORDER MODAL
  // ============================================================

  viewOrder(order: Order): void {
    this.selectedOrder = order;
    document.body.style.overflow = 'hidden';
  }

  closeOrderDetail(): void {
    this.selectedOrder = null;
    document.body.style.overflow = '';
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}