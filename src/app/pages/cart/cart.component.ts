import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartItem } from 'src/app/core/models/cart-models/cart.model';
import { Product } from 'src/app/core/models/product-models/product.model';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { SettingsService } from 'src/app/core/services/store-settings/store-settings.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  relatedProducts: Product[] = [];

  /** On-page message under the checkout button (e.g. store closed) */
  checkoutBlockMessage = '';

  private cartSubscription?: Subscription;
  private settingsSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.syncQuantitiesWithStock();

    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(() => {
      if (this.settingsService.getSettings().storeActive) {
        this.checkoutBlockMessage = '';
      }
    });

    this.relatedProducts = this.productService.getFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.settingsSubscription?.unsubscribe();
  }

  // ============================================================
  // CHECKOUT GATE
  // ============================================================

  /**
   * - Store closed → on-page message, stay on cart
   * - Guest checkout off + not logged in → login modal, stay on cart
   * - Otherwise → /checkout
   */
  proceedToCheckout(): void {
    this.checkoutBlockMessage = '';

    const settings = this.settingsService.getSettings();

    if (!settings.storeActive) {
      this.checkoutBlockMessage =
        'Checkout is unavailable right now. The store is temporarily closed.';
      return;
    }

    if (
      settings.guestCheckout !== true &&
      !this.authService.isAuthenticated()
    ) {
      this.authService.openAuthModal('login', '/checkout');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  // ============================================================
  // CART HELPERS
  // ============================================================

  getCartItemImage(item: CartItem): string {
    if (item.color && item.product.colorGalleries) {
      const gallery = item.product.colorGalleries.find(
        (g) => g.color.value === item.color?.value
      );

      if (gallery?.images?.length) {
        return gallery.images[0];
      }
    }

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