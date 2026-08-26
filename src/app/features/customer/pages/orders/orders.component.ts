import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
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