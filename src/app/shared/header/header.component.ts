import { Component, OnInit, ViewChild } from '@angular/core';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';
import { AuthComponent } from 'src/app/pages/auth/auth.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // ============================================================
  // AUTH MODAL
  // ============================================================

  @ViewChild('authModal') authModal!: AuthComponent;

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
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  // ============================================================
  // INITIALIZE
  // ============================================================

  ngOnInit(): void {
    // =========================
    // CART
    // =========================

    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    // =========================
    // WISHLIST
    // =========================

    this.wishlistService.wishlistItems$.subscribe((items) => {
      this.wishlistCount = items.length;
    });
  }

  // ============================================================
  // OPEN ACCOUNT AUTH
  // ============================================================

  openAccountAuth(): void {
    this.authModal.open('login', '/account');
  }
}