import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
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
  products: Product[] = [];
  suggestedProducts: Product[] = [];
  filters: ProductFilters = {};
  selectedSort: ProductFilters['sort'] = 'default';

  totalItems = 0;
  currentPage = 1;
  pageSize = 12;

  private queryParamsSubscription!: Subscription;
  private combinedDataSubscription!: Subscription;
  private filtersSubscription!: Subscription;

  private currentFilters: {
    category?: string;
    subcategory?: string;
    collection?: string;
  } = {};

  constructor(
    private productService: ProductService,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Sync URL query params -> Product & Pagination Services
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      const page = params['page'] ? Number(params['page']) : 1;

      // Update private state inside PaginationService
      this.paginationService.setPage(page);

      // Update filters in ProductService
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
    });

    // 2. Combine filtered products + page changes to slice the grid
    this.combinedDataSubscription = combineLatest([
      this.productService.filteredProducts$,
      this.paginationService.currentPage$,
      this.paginationService.pageSize$,
    ]).subscribe(([filteredProducts, page, size]) => {
      // Keep total items synced
      this.totalItems = filteredProducts.length;
      this.paginationService.setTotalItems(this.totalItems);
      
      this.currentPage = page;
      this.pageSize = size;

      // Slice filtered products for current page view
      const start = (page - 1) * size;
      this.products = filteredProducts.slice(start, start + size);
    });

    // 3. Keep local copy for page title header
    this.filtersSubscription = this.productService.filters$.subscribe(
      (filters) => {
        this.currentFilters = filters;
      }
    );

    this.suggestedProducts = this.productService.getFeaturedProducts(8);
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
    this.combinedDataSubscription?.unsubscribe();
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

  // Handle page change emitted from <app-pagination>
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
      queryParams: { rating: rating ?? null, page: 1 }, // Reset to page 1 on filter
      queryParamsHandling: 'merge',
    });
  }

  onPriceChange(range: { minPrice: number; maxPrice: number }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
        page: 1, // Reset to page 1 on filter
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

  private formatLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}