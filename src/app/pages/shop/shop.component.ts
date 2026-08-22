import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductFilters } from 'src/app/core/models/product-models/product-filter.model';

import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  suggestedProducts: Product[] = [];
  filters: ProductFilters = {};

  private queryParamsSubscription!: Subscription;
  private productsSubscription!: Subscription;
  private filtersSubscription!: Subscription;

  // used by pageTitle in template
  private currentFilters: {
    category?: string;
    subcategory?: string;
    collection?: string;
  } = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // URL → service filters
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
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

    // Service → product grid
    this.productsSubscription =
      this.productService.filteredProducts$.subscribe((products) => {
        this.products = products;
      });

    // Optional: keep local copy for pageTitle
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

  onRatingChange(rating: number | undefined): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { rating: rating ?? null },
      queryParamsHandling: 'merge',
    });
  }

  onPriceChange(range: { minPrice: number; maxPrice: number }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
      },
      queryParamsHandling: 'merge',
    });
  }

  private formatLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}