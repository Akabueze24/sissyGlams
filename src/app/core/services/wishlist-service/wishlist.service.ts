import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../models/product-models/product.model';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  // ============================================================
  // WISHLIST ITEMS
  // ============================================================

  private wishlistItems: Product[] = this.loadWishlist();

  private wishlistItemsSubject = new BehaviorSubject<Product[]>(
    this.wishlistItems,
  );

  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // LOAD WISHLIST FROM LOCAL STORAGE
  // ============================================================

  private loadWishlist(): Product[] {
    const savedWishlist = localStorage.getItem('wishlist');

    if (!savedWishlist) {
      return [];
    }

    try {
      const wishlist = JSON.parse(savedWishlist);

      // Make sure localStorage contains an array
      if (!Array.isArray(wishlist)) {
        return [];
      }

      // Remove invalid wishlist items
      return wishlist.filter(
        (product): product is Product =>
          product !== null &&
          product !== undefined &&
          typeof product.id === 'string',
      );
    } catch {
      return [];
    }
  }

  // ============================================================
  // SAVE WISHLIST TO LOCAL STORAGE
  // ============================================================

  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  // ============================================================
  // ADD TO WISHLIST
  // ============================================================

  addToWishlist(product: Product): void {
    // Safety check
    if (!product) {
      return;
    }

    const alreadyExists = this.wishlistItems.some(
      (item) => item.id === product.id,
    );

    // Product is already in wishlist
    if (alreadyExists) {
      this.toastService.info(`${product.name} is already in your wishlist.`);

      return;
    }

    // Add product
    this.wishlistItems.push(product);

    // Save to local storage
    this.saveWishlist();

    // Notify subscribers
    this.wishlistItemsSubject.next(this.wishlistItems);

    // Show success message
    this.toastService.success(
      `${product.name} has been added to your wishlist.`,
    );
  }

  // ============================================================
  // REMOVE FROM WISHLIST
  // ============================================================

  removeFromWishlist(product: Product): void {
    // Safety check
    if (!product) {
      return;
    }

    const index = this.wishlistItems.findIndex(
      (item) => item.id === product.id,
    );

    if (index === -1) {
      return;
    }

    // Remove product
    this.wishlistItems.splice(index, 1);

    // Save to local storage
    this.saveWishlist();

    // Notify subscribers
    this.wishlistItemsSubject.next(this.wishlistItems);

    // Show success message
    this.toastService.success(
      `${product.name} has been removed from your wishlist.`,
    );
  }

  // ============================================================
  // CHECK IF PRODUCT IS IN WISHLIST
  // ============================================================

  isInWishlist(product: Product): boolean {
    if (!product) {
      return false;
    }

    return this.wishlistItems.some((item) => item.id === product.id);
  }

  // ============================================================
  // GET WISHLIST ITEMS
  // ============================================================

  getWishlistItems(): Product[] {
    return this.wishlistItems;
  }

  // ============================================================
  // WISHLIST COUNT
  // ============================================================

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }
}
