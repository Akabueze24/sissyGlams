import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../models/product-models/product.model';
import { ToastService } from '../toast-service/toast.service';
import { AuthService } from '../auth-service/auth.service';
import { environment } from 'src/environments/environment';

interface WishlistApiResponse {
  products: any[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly apiUrl = `${environment.apiUrl}/wishlist`;
  private readonly LOCAL_KEY = 'wishlist';

  private wishlistItems: Product[] = this.loadWishlist();

  private wishlistItemsSubject = new BehaviorSubject<Product[]>(
    this.wishlistItems,
  );
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    // Page refresh while logged in → load server wishlist
    if (this.authService.isAuthenticated()) {
      this.loadFromApi();
    }
  }

  // ============================================================
  // LOAD / SAVE (local + server)
  // ============================================================

  private loadWishlist(): Product[] {
    const saved = localStorage.getItem(this.LOCAL_KEY);
    if (!saved) {
      return [];
    }

    try {
      const list = JSON.parse(saved);
      if (!Array.isArray(list)) {
        return [];
      }

      return list.filter(
        (product): product is Product =>
          product != null && typeof product.id === 'string',
      );
    } catch {
      return [];
    }
  }

  /**
   * Always update UI + localStorage.
   * Logged in → also PUT /api/wishlist with product ids.
   */
  private updateWishlist(): void {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.wishlistItems));
    this.wishlistItemsSubject.next(this.wishlistItems);

    if (this.authService.isAuthenticated()) {
      this.http
        .put<WishlistApiResponse>(this.apiUrl, {
          productIds: this.wishlistItems.map((p) => p.id),
        })
        .subscribe({
          error: () => {
            // UI already updated; next change can retry
          },
        });
    }
  }

  /** GET /api/wishlist — after login or refresh while logged in */
  loadFromApi(): void {
    this.http.get<WishlistApiResponse>(this.apiUrl).subscribe({
      next: (res) => {
        this.wishlistItems = this.fromApiProducts(res.products || []);
        localStorage.setItem(
          this.LOCAL_KEY,
          JSON.stringify(this.wishlistItems),
        );
        this.wishlistItemsSubject.next(this.wishlistItems);
      },
      error: () => {
        // Keep local list if API fails
      },
    });
  }

  /** Call after successful login/register (same idea as cart) */
  syncAfterLogin(): void {
    this.loadFromApi();
  }

  /** Populate may return _id — normalize to Product.id */
  private fromApiProducts(list: any[]): Product[] {
    return list
      .filter((p) => p)
      .map((p) => {
        return {
          ...p,
          id: p.id || p._id,
        } as Product;
      });
  }

  // ============================================================
  // ADD / REMOVE / QUERY
  // ============================================================

  addToWishlist(product: Product): void {
    if (!product) {
      return;
    }

    const alreadyExists = this.wishlistItems.some(
      (item) => item.id === product.id,
    );

    if (alreadyExists) {
      this.toastService.info(`${product.name} is already in your wishlist.`);
      return;
    }

    this.wishlistItems.push(product);
    this.updateWishlist();
    this.toastService.success(
      `${product.name} has been added to your wishlist.`,
    );
  }

  removeFromWishlist(product: Product): void {
    if (!product) {
      return;
    }

    const index = this.wishlistItems.findIndex(
      (item) => item.id === product.id,
    );

    if (index === -1) {
      return;
    }

    this.wishlistItems.splice(index, 1);
    this.updateWishlist();
    this.toastService.success(
      `${product.name} has been removed from your wishlist.`,
    );
  }

  isInWishlist(product: Product): boolean {
    if (!product) {
      return false;
    }
    return this.wishlistItems.some((item) => item.id === product.id);
  }

  getWishlistItems(): Product[] {
    return this.wishlistItems;
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }
}