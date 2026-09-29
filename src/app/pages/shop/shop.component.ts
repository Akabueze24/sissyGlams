import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductFilters } from 'src/app/core/models/product-models/product-filter.model';
import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { PaginationService } from 'src/app/core/services/pagination-service/pagination.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  /** Products for the current page only */
  products: Product[] = [];

  /** Full filtered list length (for pagination UI) */
  totalItems = 0;

  suggestedProducts: Product[] = [];
  filters: ProductFilters = {};
  selectedSort: ProductFilters['sort'] = 'default';

  /** Page state — owned here; synced from URL */
  currentPage = 1;
  pageSize = 12;

  private queryParamsSubscription!: Subscription;
  private productsSubscription!: Subscription;
  private filtersSubscription!: Subscription;

  private currentFilters: {
    category?: string;
    subcategory?: string;
    collection?: string;
  } = {};

  /** Latest filtered list (before slice) */
  private filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) URL → filters + page
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        const page = params['page'] ? Number(params['page']) : 1;
        this.currentPage = Number.isFinite(page) && page > 0 ? page : 1;

        this.productService.setFilters({
          category: params['category'] || undefined,
          subcategory: params['subcategory'] || undefined,
          collection: params['collection'] || undefined,
          search: params['search'] || undefined,
          brand: params['brand'] || undefined,
          rating: params['rating'] ? Number(params['rating']) : undefined,
          minPrice: params['minPrice'] ? Number(params['minPrice']) : undefined,
          maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : undefined,
        });

        this.applyPageSlice();
      }
    );

    // 2) Filtered catalog → slice for current page
    this.productsSubscription =
      this.productService.filteredProducts$.subscribe((filtered) => {
        this.filteredProducts = filtered;
        this.totalItems = filtered.length;

        // If filters shrink the list, don't stay on an empty page
        this.currentPage = this.paginationService.clampPage(
          this.currentPage,
          this.totalItems,
          this.pageSize
        );

        this.applyPageSlice();
      });

    // 3) Title header
    this.filtersSubscription = this.productService.filters$.subscribe(
      (filters) => {
        this.currentFilters = filters;
      }
    );

    this.suggestedProducts = this.productService.getFeaturedProducts(8);
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
    this.filtersSubscription?.unsubscribe();
  }

  get pageTitle(): string {
    if (this.currentFilters.collection) {
      return this.formatLabel(this.currentFilters.collection);
    }
    if (this.currentFilters.subcategory) {
      return this.formatLabel(this.currentFilters.subcategory);
    }
    if (this.currentFilters.category) {
      return this.formatLabel(this.currentFilters.category);
    }
    return 'Shop';
  }

  /** <app-pagination> → update URL (source of truth for page) */
  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  onRatingChange(rating: number | undefined): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { rating: rating ?? null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onPriceChange(range: { minPrice: number; maxPrice: number }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value as ProductFilters['sort'];

    this.productService.patchFilters({
      sort: this.selectedSort,
    });
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private applyPageSlice(): void {
    this.products = this.paginationService.slicePage(
      this.filteredProducts,
      this.currentPage,
      this.pageSize
    );
  }

  private formatLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}