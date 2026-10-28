import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from '../../models/cart-models/cart.model';
import { Product } from '../../models/product-models/product.model';
import { ToastService } from '../toast-service/toast.service';
import { ProductService } from '../product-service/product.service';
import { AuthService } from '../auth-service/auth.service';
import { environment } from 'src/environments/environment';

interface CartApiResponse {
  items: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly LOCAL_KEY = 'cart';

  private cartItems: CartItem[] = this.loadCart();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(
    this.calculateCartCount(),
  );
  cartCount$ = this.cartCountSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(
    this.calculateCartTotal(),
  );
  cartTotal$ = this.cartTotalSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    // If already logged in on refresh, load server cart
    if (this.authService.isAuthenticated()) {
      this.loadFromApi();
    }
  }

  // ============================================================
  // LOAD / SAVE (local + server)
  // ============================================================

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem(this.LOCAL_KEY);
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Always update UI subjects.
   * Guest → localStorage only.
   * Logged in → localStorage + PUT /api/cart
   */
  private updateCart(): void {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.calculateCartCount());
    this.cartTotalSubject.next(this.calculateCartTotal());

    if (this.authService.isAuthenticated()) {
      this.http
        .put<CartApiResponse>(this.apiUrl, {
          items: this.toApiItems(this.cartItems),
        })
        .subscribe({
          error: () => {
            // UI already updated; server can retry on next change
          },
        });
    }
  }

  /** GET /api/cart — after login or page refresh while logged in */
  loadFromApi(): void {
    this.http.get<CartApiResponse>(this.apiUrl).subscribe({
      next: (res) => {
        this.cartItems = this.fromApiItems(res.items || []);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.cartItems));
        this.cartItemsSubject.next(this.cartItems);
        this.cartCountSubject.next(this.calculateCartCount());
        this.cartTotalSubject.next(this.calculateCartTotal());
      },
      error: () => {
        // Keep local cart if API fails
      },
    });
  }

  /**
   * Call after successful login/register.
   * Server cart becomes source of truth (merge can come later).
   */
  syncAfterLogin(): void {
    this.loadFromApi();
  }

  // API body: product id only (Mongo ObjectId string)
  private toApiItems(items: CartItem[]) {
    return items.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      length: item.length,
    }));
  }

  // API → CartItem (populate returns product with _id)
  private fromApiItems(lines: any[]): CartItem[] {
    return lines
      .filter((line) => line.product)
      .map((line) => {
        const p = line.product;
        const product = {
          ...p,
          id: p.id || p._id,
        } as Product;

        return {
          product,
          quantity: line.quantity,
          color: line.color,
          size: line.size,
          length: line.length,
        } as CartItem;
      });
  }

  // ============================================================
  // STOCK
  // ============================================================

 private getLiveStock(productId: string): number | null {
  const product = this.productService.getProductById(productId);

  // Product not in catalog yet (or id mismatch) → don't invent "0 stock"
  if (!product) {
    return null;
  }

  return this.productService.getAvailableStock(product);
}

syncQuantitiesWithStock(): void {
  let changed = false;

  this.cartItems = this.cartItems
    .map((item) => {
      const stock = this.getLiveStock(item.product.id);

      // Unknown product: keep line as-is
      if (stock === null) {
        return item;
      }

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
    .filter((item) => {
      const stock = this.getLiveStock(item.product.id);
      // Only drop when we KNOW stock is 0
      if (stock === null) {
        return true;
      }
      return item.quantity > 0;
    });

  if (changed) {
    this.updateCart();
    this.toastService.info('Some quantities were updated to match stock.');
  }
}

  // ============================================================
  // ADD / REMOVE / QTY (unchanged logic)
  // ============================================================

 addToCart(item: CartItem): void {
  const stock = this.getLiveStock(item.product.id);

  // Known out of stock
  if (stock !== null && stock < 1) {
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
    let nextQty = existingItem.quantity + item.quantity;

    // Cap only when we know stock
    if (stock !== null && nextQty > stock) {
      existingItem.quantity = stock;
      this.updateCart();
      this.toastService.info(
        `Only ${stock} available. Quantity updated to ${stock}.`,
      );
      return;
    }

    existingItem.quantity = nextQty;
  } else {
    const qty =
      stock !== null ? Math.min(item.quantity, stock) : item.quantity;

    if (qty < 1) {
      this.toastService.info('This product is out of stock.');
      return;
    }

    this.cartItems.push({
      ...item,
      quantity: qty,
    });
  }

  this.updateCart();
  this.toastService.success('Product added to your cart.');
}

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  removeCartItems(item: CartItem): void {
    const index = this.cartItems.indexOf(item);

    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateCart();
      this.toastService.info('Product removed from your cart.');
    }
  }

  increaseQuantity(item: CartItem): void {
  const stock = this.getLiveStock(item.product.id);

  if (stock === null) {
    // No live stock info — allow +1 (or skip; your choice)
    item.quantity++;
    this.updateCart();
    return;
  }

  if (item.quantity >= stock) {
    this.toastService.info(
      stock < 1 ? 'This product is out of stock.' : `Only ${stock} available.`,
    );
    return;
  }

  item.quantity++;
  this.updateCart();
}

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  private calculateCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  private calculateCartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  getCartCount(): number {
    return this.calculateCartCount();
  }

  getCartTotal(): number {
    return this.calculateCartTotal();
  }

  /** Clears local + Mongo (PUT items: []) when logged in */
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
    this.toastService.info('Your cart has been cleared.');
  }
}
