import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';

import { User } from 'src/app/core/models/auth-models/user.model';
import { CategoryNavItem } from 'src/app/core/models/product-models/category-nav-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // ============================================================
  // CART
  // ============================================================

  cartCount = 0;
  cartTotal = 0;

  // ============================================================
  // WISHLIST
  // ============================================================

  wishlistCount = 0;

  // ============================================================
  // AUTH
  // ============================================================

  currentUser: User | null = null;

  private userSubscription!: Subscription;

  // ============================================================
  // CATEGORY NAV
  // ============================================================

  categoryNav: CategoryNavItem[] = [];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    // Cart
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    // Wishlist
    this.wishlistService.wishlistItems$.subscribe((items) => {
      this.wishlistCount = items.length;
    });

    // Auth
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Category navigation
    this.categoryNav = this.productService.getCategoryNav();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // ============================================================
  // AUTH ACTIONS
  // ============================================================

  onAccountClick(): void {
    if (this.currentUser) {
      this.router.navigate(['/account']);
    } else {
      this.authService.openAuthModal('login', '/account');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}