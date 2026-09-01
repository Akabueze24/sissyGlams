import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from '../../models/cart-models/cart.model';
import { ToastService } from '../toast-service/toast.service';
import { ProductService } from '../product-service/product.service';

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
    this.calculateCartCount()
  );

  cartCount$ = this.cartCountSubject.asObservable();

  // ============================================================
  // CART TOTAL
  // ============================================================

  private cartTotalSubject = new BehaviorSubject<number>(
    this.calculateCartTotal()
  );

  cartTotal$ = this.cartTotalSubject.asObservable();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private toastService: ToastService,
    private productService: ProductService
  ) {}

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
    this.saveCart();
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.calculateCartCount());
    this.cartTotalSubject.next(this.calculateCartTotal());
  }

  // ============================================================
  // SAVE CART TO LOCAL STORAGE
  // ============================================================

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // ============================================================
  // STOCK (live from ProductService — not the cart snapshot)
  // ============================================================

  private getLiveStock(productId: string): number {
    const product = this.productService.getProductById(productId);

    if (!product) {
      return 0;
    }

    return this.productService.getAvailableStock(product);
  }

  /**
   * Fix quantities if admin lowered stock after items were added.
   * Call when opening cart / checkout.
   */
  syncQuantitiesWithStock(): void {
    let changed = false;

    this.cartItems = this.cartItems
      .map((item) => {
        const stock = this.getLiveStock(item.product.id);

        if (stock < 1) {
          changed = true;
          return { ...item, quantity: 0 };
        }

        if (item.quantity > stock) {
          changed = true;
          return { ...item, quantity: stock };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    if (changed) {
      this.updateCart();
      this.toastService.info('Some quantities were updated to match stock.');
    }
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  addToCart(item: CartItem): void {
    const stock = this.getLiveStock(item.product.id);

    if (stock < 1) {
      this.toastService.info('This product is out of stock.');
      return;
    }

    const existingItem = this.cartItems.find((cartItem) => {
      return (
        cartItem.product.id === item.product.id &&
        cartItem.color?.value === item.color?.value &&
        cartItem.size?.value === item.size?.value &&
        cartItem.length?.value === item.length?.value
      );
    });

    if (existingItem) {
      const nextQty = existingItem.quantity + item.quantity;

      if (nextQty > stock) {
        existingItem.quantity = stock;
        this.updateCart();
        this.toastService.info(
          `Only ${stock} available. Quantity updated to ${stock}.`
        );
        return;
      }

      existingItem.quantity = nextQty;
    } else {
      const qty = Math.min(item.quantity, stock);

      if (qty < 1) {
        this.toastService.info('This product is out of stock.');
        return;
      }

      // Keep full item (product + color/size/length) — colorGalleries stay on product
      this.cartItems.push({
        ...item,
        quantity: qty,
      });
    }

    this.updateCart();
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
      this.toastService.info('Product removed from your cart.');
    }
  }

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  increaseQuantity(item: CartItem): void {
    const stock = this.getLiveStock(item.product.id);

    if (item.quantity >= stock) {
      this.toastService.info(
        stock < 1
          ? 'This product is out of stock.'
          : `Only ${stock} available.`
      );
      return;
    }

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
    this.toastService.info('Your cart has been cleared.');
  }
}