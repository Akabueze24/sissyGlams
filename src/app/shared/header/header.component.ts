import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';

import { User } from 'src/app/core/models/auth-models/user.model';
import { Product } from 'src/app/core/models/product-models/product.model';
import { CategoryNavItem } from 'src/app/core/models/product-models/category-nav-item.model';
import { StoreCollection } from 'src/app/core/models/product-models/store-collection.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // ============================================================
  // SEARCH
  // ============================================================

  searchTerm = '';
  suggestions: Product[] = [];
  showSuggestions = false;

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
  // NAV
  // ============================================================

  categoryNav: CategoryNavItem[] = [];
  storeCollections: StoreCollection[] = [];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    this.wishlistService.wishlistItems$.subscribe((items) => {
      this.wishlistCount = items.length;
    });

    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.categoryNav = this.productService.getCategoryNav();
    this.storeCollections = this.productService.getStoreCollections();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // ============================================================
  // SEARCH
  // ============================================================
  // ============================================================
  // SEARCH
  // ============================================================

  onSearchInput(): void {
    const term = this.searchTerm.trim();

    if (!term) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.suggestions = this.productService.searchSuggestions(term);

    this.showSuggestions = this.suggestions.length > 0;
  }

  onSearch(event: Event): void {
    event.preventDefault();

    const term = this.searchTerm.trim();

    this.showSuggestions = false;
    this.suggestions = [];

    this.router.navigate(['/shop'], {
      queryParams: term ? { search: term } : {},
    });
  }

  goToProduct(product: Product): void {
    this.showSuggestions = false;
    this.searchTerm = '';
    this.suggestions = [];

    this.router.navigate(['/product-view', product.slug]);
  }

  closeSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }
  // ============================================================
  // AUTH
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
