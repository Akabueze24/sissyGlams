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
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  private userSubscription!: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
  if (!user) {
    this.orders = [];
    this.selectedOrder = null;
    return;
  }

  this.orderService.loadMyOrders().subscribe((list) => {
    this.orders = list;

    if (
      this.selectedOrder &&
      !this.orders.some((o) => o.id === this.selectedOrder?.id)
    ) {
      this.selectedOrder = null;
    }
  });
});
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
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
      (o) => o.orderStatus === 'pending' || o.orderStatus === 'processing',
    ).length;
  }

  get completedCount(): number {
    return this.orders.filter(
      (o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped',
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