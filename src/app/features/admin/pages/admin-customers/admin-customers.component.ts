import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

/** One row in the admin customers table */
export interface CustomerRow {
  /** Stable key = normalized email */
  id: string;
  name: string;
  email: string;
  initials: string;
  joinedAt: string;
  joinedLabel: string;
  orderCount: number;
  totalSpent: number;
  totalSpentLabel: string;
  /** active = older customer; new = first order within last 30 days */
  status: 'active' | 'new';
}

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.scss'],
})
export class AdminCustomersComponent implements OnInit, OnDestroy {
  // ============================================================
  // LIST
  // ============================================================

  customers: CustomerRow[] = [];
  filteredCustomers: CustomerRow[] = [];

  searchTerm = '';
  statusFilter: '' | 'active' | 'new' = '';

  totalCustomers = 0;
  activeCustomers = 0;
  newCustomers = 0;
  /** Always 0 until real user accounts / blocking exist */
  blockedCustomers = 0;

  // ============================================================
  // VIEW CUSTOMER
  // ============================================================

  showViewModal = false;
  selectedCustomer: CustomerRow | null = null;
  selectedCustomerOrders: Order[] = [];

  /** Full order list — used to build customers and the view panel */
  private allOrders: Order[] = [];

  private ordersSub!: Subscription;

  constructor(private orderService: OrderService) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.ordersSub = this.orderService.orders$.subscribe((orders) => {
      this.allOrders = orders;
      this.customers = this.buildCustomersFromOrders(orders);
      this.updateSummary();
      this.applyFilters();

      // Keep view modal in sync if it is open
      if (this.selectedCustomer) {
        this.selectedCustomerOrders = this.getOrdersForEmail(
          this.selectedCustomer.email
        );

        const updated = this.customers.find(
          (c) => c.id === this.selectedCustomer!.id
        );

        if (updated) {
          this.selectedCustomer = updated;
        } else {
          this.closeViewModal();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.ordersSub?.unsubscribe();
    document.body.style.overflow = '';
  }

  // ============================================================
  // BUILD CUSTOMERS (one row per unique email)
  // ============================================================

  private buildCustomersFromOrders(orders: Order[]): CustomerRow[] {
    const map = new Map<
      string,
      {
        email: string;
        firstName: string;
        lastName: string;
        firstOrderAt: Date;
        orderCount: number;
        totalSpent: number;
      }
    >();

    for (const order of orders) {
      const email = (order.customer?.email || '').trim().toLowerCase();
      if (!email) {
        continue;
      }

      const created = order.createdAt
        ? new Date(order.createdAt)
        : new Date();
      if (Number.isNaN(created.getTime())) {
        continue;
      }

      const firstName = order.customer?.firstName?.trim() || '';
      const lastName = order.customer?.lastName?.trim() || '';
      const spent =
        order.orderStatus === 'cancelled' ? 0 : order.total || 0;

      const existing = map.get(email);

      if (!existing) {
        map.set(email, {
          email,
          firstName,
          lastName,
          firstOrderAt: created,
          orderCount: 1,
          totalSpent: spent,
        });
      } else {
        existing.orderCount += 1;
        existing.totalSpent += spent;

        if (created < existing.firstOrderAt) {
          existing.firstOrderAt = created;
        }

        if (!existing.firstName && firstName) {
          existing.firstName = firstName;
        }
        if (!existing.lastName && lastName) {
          existing.lastName = lastName;
        }
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return [...map.values()]
      .map((c) => {
        const name =
          [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email;
        const isNew = c.firstOrderAt >= thirtyDaysAgo;

        return {
          id: c.email,
          name,
          email: c.email,
          initials: this.makeInitials(c.firstName, c.lastName, c.email),
          joinedAt: c.firstOrderAt.toISOString(),
          joinedLabel: c.firstOrderAt.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          orderCount: c.orderCount,
          totalSpent: c.totalSpent,
          totalSpentLabel: `$${c.totalSpent.toFixed(2)}`,
          status: isNew ? 'new' : 'active',
        } as CustomerRow;
      })
      .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
  }

  private makeInitials(
    first: string,
    last: string,
    email: string
  ): string {
    if (first || last) {
      const initials = `${(first[0] || '').toUpperCase()}${(
        last[0] || ''
      ).toUpperCase()}`;
      return initials || email[0].toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  }

  private updateSummary(): void {
    this.totalCustomers = this.customers.length;
    this.activeCustomers = this.customers.filter(
      (c) => c.status === 'active'
    ).length;
    this.newCustomers = this.customers.filter(
      (c) => c.status === 'new'
    ).length;
    this.blockedCustomers = 0;
  }

  // ============================================================
  // FILTER
  // ============================================================

  onSearchOrFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let list = [...this.customers];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter === 'active' || this.statusFilter === 'new') {
      list = list.filter((c) => c.status === this.statusFilter);
    }

    this.filteredCustomers = list;
  }

  trackByCustomer(_index: number, row: CustomerRow): string {
    return row.id;
  }

  statusClass(status: CustomerRow['status']): string {
    return status === 'new'
      ? 'admin-customers__status--new'
      : 'admin-customers__status--active';
  }

  statusLabel(status: CustomerRow['status']): string {
    return status === 'new' ? 'New' : 'Active';
  }

  // ============================================================
  // VIEW CUSTOMER
  // ============================================================

  openViewModal(customer: CustomerRow): void {
    this.selectedCustomer = customer;
    this.selectedCustomerOrders = this.getOrdersForEmail(customer.email);
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCustomer = null;
    this.selectedCustomerOrders = [];
    document.body.style.overflow = '';
  }

  private getOrdersForEmail(email: string): Order[] {
    const normalized = email.trim().toLowerCase();
    return this.allOrders.filter(
      (order) =>
        (order.customer?.email || '').trim().toLowerCase() === normalized
    );
  }

  orderStatusLabel(status: Order['orderStatus']): string {
    if (!status) {
      return '—';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  orderStatusClass(status: Order['orderStatus']): string {
    switch (status) {
      case 'pending':
        return 'admin-customers__order-status--pending';
      case 'processing':
        return 'admin-customers__order-status--processing';
      case 'shipped':
        return 'admin-customers__order-status--shipped';
      case 'delivered':
        return 'admin-customers__order-status--delivered';
      case 'cancelled':
        return 'admin-customers__order-status--cancelled';
      default:
        return '';
    }
  }

  formatOrderDate(iso: string | undefined): string {
    if (!iso) {
      return '—';
    }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return '—';
    }
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatMoney(amount: number | undefined): string {
    return `$${(amount ?? 0).toFixed(2)}`;
  }
}