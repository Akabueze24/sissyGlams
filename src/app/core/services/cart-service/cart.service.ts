import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from '../../models/cart-models/cart.model';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // ============================================================
  // CART ITEMS
  // ============================================================

  private cartItems: CartItem[] = this.loadCart();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  cartItems$ = this.cartItemsSubject.asObservable();

  // ============================================================
  // CART COUNT
  // ============================================================

  private cartCountSubject = new BehaviorSubject<number>(
    this.calculateCartCount(),
  );

  cartCount$ = this.cartCountSubject.asObservable();

  // ============================================================
  // CART TOTAL
  // ============================================================

  private cartTotalSubject = new BehaviorSubject<number>(
    this.calculateCartTotal(),
  );

  cartTotal$ = this.cartTotalSubject.asObservable();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // LOAD CART FROM LOCAL STORAGE
  // ============================================================

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem('cart');

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  }

  // ============================================================
  // SAVE + BROADCAST CART CHANGES
  // ============================================================

  private updateCart(): void {
    // Save the latest cart
    this.saveCart();

    // Tell anyone listening that the cart changed
    this.cartItemsSubject.next(this.cartItems);

    // Tell anyone listening the new cart count
    this.cartCountSubject.next(this.calculateCartCount());

    // Tell anyone listening the new cart total
    this.cartTotalSubject.next(this.calculateCartTotal());
  }

  // ============================================================
  // SAVE CART TO LOCAL STORAGE
  // ============================================================

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find((cartItem) => {
      return (
        cartItem.product.id === item.product.id &&
        cartItem.color?.value === item.color?.value &&
        cartItem.size?.value === item.size?.value &&
        cartItem.length?.value === item.length?.value
      );
    });

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    this.updateCart();

    // Toast notification
    this.toastService.success('Product added to your cart.');
  }

  // ============================================================
  // GET CART ITEMS
  // ============================================================

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  removeCartItems(item: CartItem): void {
    const index = this.cartItems.indexOf(item);

    if (index !== -1) {
      this.cartItems.splice(index, 1);

      this.updateCart();

      // Toast notification
      this.toastService.info('Product removed from your cart.');
    }
  }

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  increaseQuantity(item: CartItem): void {
    item.quantity++;

    this.updateCart();
  }

  // ============================================================
  // DECREASE QUANTITY
  // ============================================================

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;

      this.updateCart();
    }
  }

  // ============================================================
  // CALCULATE CART COUNT
  // ============================================================

  private calculateCartCount(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  // ============================================================
  // CALCULATE CART TOTAL
  // ============================================================

  private calculateCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  // ============================================================
  // GET CART COUNT
  // ============================================================

  getCartCount(): number {
    return this.calculateCartCount();
  }

  // ============================================================
  // GET CART TOTAL
  // ============================================================

  getCartTotal(): number {
    return this.calculateCartTotal();
  }

  // ============================================================
  // CLEAR CART
  // ============================================================

  clearCart(): void {
    this.cartItems = [];

    this.updateCart();

    // Toast notification
    this.toastService.info('Your cart has been cleared.');
  }
}
