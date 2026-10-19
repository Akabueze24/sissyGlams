import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from 'src/app/core/models/auth-models/user.model';
import { Order } from 'src/app/core/models/order-models/order.model';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  selectedOrder: Order | null = null;
  orders: Order[] = [];

  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      const email = user?.email?.trim();

      if (!email) {
        this.orders = [];
        this.selectedOrder = null;
        return;
      }

      this.orderService.loadOrdersByEmail(email).subscribe((list) => {
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

  toggleOrderDetails(order: Order): void {
    if (this.selectedOrder?.id === order.id) {
      this.selectedOrder = null;
    } else {
      this.selectedOrder = order;
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}