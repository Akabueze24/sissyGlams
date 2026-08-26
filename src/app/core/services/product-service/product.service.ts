import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { Product } from '../../models/product-models/product.model';
import { ProductFilters } from '../../models/product-models/product-filter.model';
import { Category } from '../../models/product-models/category.model';
import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { SUBCATEGORIES } from '../../models/product-models/subcategories.model';
import { PRODUCTS } from '../../data/product';
import { StoreCollection } from '../../models/product-models/store-collection.model';
import { STORE_COLLECTIONS } from '../../models/product-models/store-collections';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ============================================================
  // STATE (private subjects)
  // ============================================================

  private productsSource = new BehaviorSubject<Product[]>(
    PRODUCTS.filter((product) => product.active),
  );

  private filtersSource = new BehaviorSubject<ProductFilters>({});

  // ============================================================
  // PUBLIC OBSERVABLES
  // ============================================================

  products$ = this.productsSource.asObservable();
  filters$ = this.filtersSource.asObservable();

  filteredProducts$: Observable<Product[]> = combineLatest([
    this.products$,
    this.filters$,
  ]).pipe(map(([products, filters]) => this.applyFilters(products, filters)));

  // ============================================================
  // FILTER STATE
  // ============================================================

  setFilters(filters: ProductFilters): void {
    this.filtersSource.next(filters);
  }

  patchFilters(partial: ProductFilters): void {
    this.filtersSource.next({
      ...this.filtersSource.value,
      ...partial,
    });
  }

  getFilters(): ProductFilters {
    return this.filtersSource.value;
  }

  // ============================================================
  // LOOKUPS
  // ============================================================

  getProductById(id: string): Product | undefined {
    return this.productsSource.value.find((product) => product.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.productsSource.value.find((product) => product.slug === slug);
  }

  getProductsByCollection(collectionSlug: string): Product[] {
    return this.productsSource.value.filter((product) =>
      product.collections?.some(
        (collection) => collection.slug === collectionSlug,
      ),
    );
  }

  getFeaturedProducts(limit: number = 8): Product[] {
    return this.getProductsByCollection('featured').slice(0, limit);
  }

  getOnSaleProducts(limit: number = 8): Product[] {
    return this.productsSource.value
      .filter(
        (product) =>
          product.oldPrice != null && product.oldPrice > product.price,
      )
      .slice(0, limit);
  }

  getRelatedProducts(product: Product, limit: number = 8): Product[] {
    const sameCategory = this.productsSource.value.filter(
      (item) => item.id !== product.id && item.category === product.category,
    );

    const sameSubcategory = sameCategory.filter(
      (item) => item.subcategory === product.subcategory,
    );

    let pool = sameSubcategory.length >= limit ? sameSubcategory : sameCategory;

    if (pool.length < limit) {
      const others = this.productsSource.value.filter(
        (item) => item.id !== product.id && !pool.some((p) => p.id === item.id),
      );
      pool = [...pool, ...others];
    }

    return pool.slice(0, limit);
  }

  getProductsByCategory(category: Category): Product[] {
    return this.productsSource.value.filter(
      (product) => product.category === category,
    );
  }

  getProductsBySubcategory(subcategory: string): Product[] {
    return this.productsSource.value.filter(
      (product) => product.subcategory === subcategory,
    );
  }

  /**
   * Live search suggestions for the header dropdown.
   * Requires at least 2 characters.
   */
  searchSuggestions(term: string, limit: number = 6): Product[] {
    const value = term.trim().toLowerCase();

    if (value.length < 2) {
      return [];
    }

    return this.applyFilters(this.productsSource.value, {
      search: value,
    }).slice(0, limit);
  }

  getPriceRange(): { min: number; max: number } {
    const products = this.productsSource.value;

    if (!products.length) {
      return { min: 0, max: 100 };
    }

    const prices = products.map((product) => product.price);

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }

  getCategoryNav(): CategoryNavItem[] {
    const categoryOrder: Category[] = [
      'dresses',
      'wigs',
      'lingerie',
      'shapers',
      'shoes',
      'tops',
      'bottoms',
      'sissy-toys',
      'make-up',
      'accessories',
      'ebooks',
    ];

    return categoryOrder.map((category) => ({
      category,
      label: this.formatCategoryLabel(category),
      subcategories: SUBCATEGORIES.filter((sub) => sub.category === category),
    }));
  }

  getStoreCollections(): StoreCollection[] {
    return STORE_COLLECTIONS;
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private applyFilters(
    products: Product[],
    filters: ProductFilters,
  ): Product[] {
    let result = [...products];

    if (filters.search?.trim()) {
      const term = filters.search.trim().toLowerCase();

      result = result.filter((product) =>
        this.matchesSearchTerm(product, term),
      );
    }

    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    if (filters.subcategory) {
      result = result.filter(
        (product) => product.subcategory === filters.subcategory,
      );
    }

    if (filters.brand) {
      result = result.filter(
        (product) =>
          product.brand.toLowerCase() === filters.brand!.toLowerCase(),
      );
    }

    if (filters.rating != null) {
      result = result.filter((product) => product.rating >= filters.rating!);
    }

    if (filters.collection) {
      result = result.filter((product) =>
        product.collections?.some(
          (collection) => collection.slug === filters.collection,
        ),
      );
    }

    if (filters.minPrice != null) {
      result = result.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice != null) {
      result = result.filter((product) => product.price <= filters.maxPrice!);
    }

    // ============================================================
    // SORTING
    // ============================================================

    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;

      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;

      case 'default':
      default:
        // Keep the original product order.
        break;
    }

    return result;
  }

  /**
   * Checks whether a product matches a (already-lowercased, trimmed)
   * search term across name, brand, category, subcategory and
   * collections.
   */
  private matchesSearchTerm(product: Product, term: string): boolean {
    const inName = product.name.toLowerCase().includes(term);
    const inBrand = product.brand.toLowerCase().includes(term);

    const inDescription = product.productDetails.description
      .toLowerCase()
      .includes(term);

    const inCategory =
      product.category.toLowerCase().includes(term) ||
      this.formatCategoryLabel(product.category).toLowerCase().includes(term);

    const subcategoryMeta = product.subcategory
      ? SUBCATEGORIES.find((sub) => sub.slug === product.subcategory)
      : undefined;

    const inSubcategory =
      !!product.subcategory &&
      (product.subcategory.toLowerCase().includes(term) ||
        !!subcategoryMeta?.name.toLowerCase().includes(term));

    const inCollections = !!product.collections?.some(
      (collection) =>
        collection.name.toLowerCase().includes(term) ||
        collection.slug.toLowerCase().includes(term),
    );

    return (
      inName ||
      inBrand ||
      inDescription ||
      inCategory ||
      inSubcategory ||
      inCollections
    );
  }

  private formatCategoryLabel(category: Category): string {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
