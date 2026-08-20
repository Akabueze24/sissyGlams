import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { Order } from 'src/app/core/models/order-models/order.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;

  cartItems: CartItem[] = []; 

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.order = this.orderService.getOrder();

    if (!this.order) {
      this.router.navigate(['/shop']);
    }
  }

   getCartItemImage(item: CartItem): string {
      // If the cart item has a selected color
      if (item.color && item.product.colorGalleries) {
        const gallery = item.product.colorGalleries.find(
          (gallery) => gallery.color.value === item.color?.value,
        );
  
        // If we found the gallery for that color,
        // return its first image
        if (gallery?.images?.length) {
          return gallery.images[0];
        }
      }
  
      // Otherwise, use the product's normal first image
      return item.product.images[0];
    }
}
