import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product-models/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  // ============================================================
  // WISHLIST ITEMS
  // ============================================================

  private wishlistItems: Product[] = this.loadWishlist();

  private wishlistItemsSubject = new BehaviorSubject<Product[]>(
    this.wishlistItems
  );

  wishlistItems$ = this.wishlistItemsSubject.asObservable();


  // ============================================================
  // LOAD WISHLIST FROM LOCAL STORAGE
  // ============================================================

  private loadWishlist(): Product[] {

    const savedWishlist = localStorage.getItem('wishlist');

    if (savedWishlist) {
      return JSON.parse(savedWishlist);
    }

    return [];
  }


  // ============================================================
  // SAVE WISHLIST TO LOCAL STORAGE
  // ============================================================

  private saveWishlist(): void {

    localStorage.setItem(
      'wishlist',
      JSON.stringify(this.wishlistItems)
    );
  }


  // ============================================================
  // ADD TO WISHLIST
  // ============================================================

  addToWishlist(product: Product): void {

    const alreadyExists = this.wishlistItems.some(
      (item) => item.id === product.id
    );

    if (!alreadyExists) {

      this.wishlistItems.push(product);

      this.saveWishlist();

      this.wishlistItemsSubject.next(this.wishlistItems);
    }
  }


  // ============================================================
  // REMOVE FROM WISHLIST
  // ============================================================

  removeFromWishlist(product: Product): void {

    const index = this.wishlistItems.findIndex(
      (item) => item.id === product.id
    );

    if (index !== -1) {

      this.wishlistItems.splice(index, 1);

      this.saveWishlist();

      this.wishlistItemsSubject.next(this.wishlistItems);
    }
  }


  // ============================================================
  // CHECK IF PRODUCT IS IN WISHLIST
  // ============================================================

  isInWishlist(product: Product): boolean {

    return this.wishlistItems.some(
      (item) => item.id === product.id
    );
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