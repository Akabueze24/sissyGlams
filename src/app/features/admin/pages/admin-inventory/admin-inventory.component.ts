import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

/** Stock buckets for filters and badges */
export type StockFilter = '' | 'in-stock' | 'low' | 'out';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.scss'],
})
export class AdminInventoryComponent implements OnInit, OnDestroy {
  products: Product[] = [];

  searchTerm = '';
  stockFilter: StockFilter = '';

  /** Inline edit: which product is being updated */
  editingId: string | null = null;
  editStock = 0;

  private productsSubscription!: Subscription;

  /** Low stock = 1..threshold (not zero) */
  readonly lowStockThreshold = 5;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productsSubscription = this.productService.adminProducts$.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
  }

  // ============================================================
  // SUMMARY (from live data)
  // ============================================================

  get totalCount(): number {
    return this.products.length;
  }

  get inStockCount(): number {
    return this.products.filter((p) => p.stock > this.lowStockThreshold).length;
  }

  get lowStockCount(): number {
    return this.products.filter(
      (p) => p.stock > 0 && p.stock <= this.lowStockThreshold
    ).length;
  }

  get outOfStockCount(): number {
    return this.products.filter((p) => p.stock < 1).length;
  }

  // ============================================================
  // FILTERED TABLE
  // ============================================================

  get filteredProducts(): Product[] {
    let result = [...this.products];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((p) => {
        const name = p.name.toLowerCase();
        const id = p.id.toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(term) || id.includes(term) || brand.includes(term);
      });
    }

    if (this.stockFilter === 'in-stock') {
      result = result.filter((p) => p.stock > this.lowStockThreshold);
    } else if (this.stockFilter === 'low') {
      result = result.filter(
        (p) => p.stock > 0 && p.stock <= this.lowStockThreshold
      );
    } else if (this.stockFilter === 'out') {
      result = result.filter((p) => p.stock < 1);
    }

    return result;
  }

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  stockStatus(product: Product): 'in-stock' | 'low' | 'out' {
    if (product.stock < 1) return 'out';
    if (product.stock <= this.lowStockThreshold) return 'low';
    return 'in-stock';
  }

  stockStatusLabel(product: Product): string {
    const status = this.stockStatus(product);
    if (status === 'out') return 'Out of Stock';
    if (status === 'low') return 'Low Stock';
    return 'In Stock';
  }

  categoryLabel(category: string): string {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  subcategoryLabel(slug: string | undefined): string {
    if (!slug) return '—';
    return this.categoryLabel(slug);
  }

  productImage(product: Product): string {
    return product.images?.[0] || 'https://placehold.co/80x80?text=No+Image';
  }

  // ============================================================
  // QUICK STOCK EDIT
  // ============================================================

  startEditStock(product: Product): void {
    this.editingId = product.id;
    this.editStock = product.stock;
  }

  cancelEditStock(): void {
    this.editingId = null;
  }

  saveEditStock(product: Product): void {
    const stock = Math.max(0, Number(this.editStock) || 0);

    this.productService.updateProduct(product.id, { stock });

    this.editingId = null;
  }
}