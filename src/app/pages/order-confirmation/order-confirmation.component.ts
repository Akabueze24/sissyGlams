import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.order = this.orderService.getLatestOrder();

    if (!this.order) {
      this.router.navigate(['/shop']);
    }
  }
}