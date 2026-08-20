import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { CartService } from 'src/app/core/services/cart-service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
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

  increaseQuantity(item: CartItem): void {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(item);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeCartItems(item);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
}
