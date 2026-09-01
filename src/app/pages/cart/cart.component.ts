import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { Product } from 'src/app/core/models/product-models/product.model';
import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  relatedProducts: Product[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  private cartSubscription?: Subscription;

  ngOnInit(): void {
    this.cartService.syncQuantitiesWithStock();
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
    this.relatedProducts = this.productService.getFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
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

  getAvailableStock(item: CartItem): number {
    const product = this.productService.getProductById(item.product.id);
    return product ? this.productService.getAvailableStock(product) : 0;
  }

  canIncrease(item: CartItem): boolean {
    return item.quantity < this.getAvailableStock(item);
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
