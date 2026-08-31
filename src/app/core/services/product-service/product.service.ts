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
  // STORAGE
  // ============================================================

  private readonly PRODUCTS_STORAGE_KEY = 'sissy-dream-products';

  // ============================================================
  // STATE (private subjects)
  // ============================================================

  /** All products (active + inactive) — loaded from localStorage or mock */
  private productsSource = new BehaviorSubject<Product[]>(this.loadProducts());

  private filtersSource = new BehaviorSubject<ProductFilters>({});

  // ============================================================
  // PUBLIC OBSERVABLES
  // ============================================================

  products$ = this.productsSource.asObservable();
  filters$ = this.filtersSource.asObservable();

  /** Admin list: every product */
  adminProducts$ = this.productsSource.asObservable();

  /** Shop grid: only active products + current filters */
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
  // ADMIN
  // ============================================================

  getAllProducts(): Product[] {
    return this.productsSource.value;
  }

  /**
   * Set whether a product is live on the storefront.
   * Admin still sees inactive products in the list.
   */
  setProductActive(productId: string, active: boolean): void {
    const products = this.productsSource.value.map((product) =>
      product.id === productId ? { ...product, active } : product
    );

    this.setProducts(products);
  }

  /** Flip active ↔ inactive for one product */
  toggleProductActive(productId: string): void {
    const product = this.productsSource.value.find((p) => p.id === productId);

    if (!product) {
      return;
    }

    this.setProductActive(productId, !product.active);
  }

  /**
   * Create a product (minimal fields for admin "Add product").
   * Saved to memory + localStorage via setProducts.
   */
  addProduct(input: {
    name: string;
    brand: string;
    category: Category;
    subcategory?: string;
    collections?: StoreCollection[];
    price: number;
    imageUrl: string;
    description: string;
    active?: boolean;
  }): Product {
    const name = input.name.trim();
    const subcategory = this.normalizeSubcategory(
      input.category,
      input.subcategory
    );

    const product: Product = {
      id: `SD-${Date.now()}`,
      name,
      slug: this.slugify(name),
      brand: input.brand.trim(),
      category: input.category,
      subcategory,
      collections: input.collections?.length ? input.collections : undefined,
      images: [input.imageUrl.trim()],
      price: input.price,
      productDetails: {
        description: input.description.trim(),
        details: [],
        shipping: 'Ships within 2–5 business days.',
        returns: 'Eligible for return according to store policy.',
      },
      rating: 0,
      reviewCount: 0,
      active: input.active ?? true,
      createdAt: new Date().toISOString(),
    };

    this.setProducts([product, ...this.productsSource.value]);

    return product;
  }

  /**
   * Replace a product by id. Saves via setProducts (memory + localStorage).
   */
  updateProduct(productId: string, changes: Partial<Product>): Product | null {
    const current = this.productsSource.value.find((p) => p.id === productId);

    if (!current) {
      return null;
    }

    const name = changes.name?.trim() ?? current.name;
    const category = changes.category ?? current.category;

    // Prefer explicit subcategory from changes; otherwise keep current.
    // Then force it to match the final category (or clear it).
    const rawSubcategory =
      changes.subcategory !== undefined
        ? changes.subcategory
        : current.subcategory;

    const subcategory = this.normalizeSubcategory(category, rawSubcategory);

    const updated: Product = {
      ...current,
      ...changes,
      id: current.id,
      name,
      slug: changes.name ? this.slugify(name) : current.slug,
      brand: changes.brand?.trim() ?? current.brand,
      category,
      subcategory,
      images:
        changes.images && changes.images.length
          ? changes.images
          : current.images,
      productDetails: changes.productDetails
        ? {
            ...current.productDetails,
            ...changes.productDetails,
          }
        : current.productDetails,
    };

    const products = this.productsSource.value.map((p) =>
      p.id === productId ? updated : p
    );

    this.setProducts(products);

    return updated;
  }

  /**
   * Permanently delete a product by id.
   * Updates memory + localStorage through setProducts().
   */
  deleteProduct(productId: string): boolean {
    const products = this.productsSource.value;

    const productExists = products.some((product) => product.id === productId);

    if (!productExists) {
      return false;
    }

    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    this.setProducts(updatedProducts);

    return true;
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
    return this.productsSource.value.filter(
      (product) =>
        product.active &&
        product.collections?.some(
          (collection) => collection.slug === collectionSlug
        )
    );
  }

  getFeaturedProducts(limit: number = 8): Product[] {
    return this.getProductsByCollection('featured').slice(0, limit);
  }

  getOnSaleProducts(limit: number = 8): Product[] {
    return this.productsSource.value
      .filter(
        (product) =>
          product.active &&
          product.oldPrice != null &&
          product.oldPrice > product.price
      )
      .slice(0, limit);
  }

  getRelatedProducts(product: Product, limit: number = 8): Product[] {
    const sameCategory = this.productsSource.value.filter(
      (item) =>
        item.active &&
        item.id !== product.id &&
        item.category === product.category
    );

    const sameSubcategory = sameCategory.filter(
      (item) => item.subcategory === product.subcategory
    );

    let pool =
      sameSubcategory.length >= limit ? sameSubcategory : sameCategory;

    if (pool.length < limit) {
      const others = this.productsSource.value.filter(
        (item) =>
          item.active &&
          item.id !== product.id &&
          !pool.some((p) => p.id === item.id)
      );
      pool = [...pool, ...others];
    }

    return pool.slice(0, limit);
  }

  getProductsByCategory(category: Category): Product[] {
    return this.productsSource.value.filter(
      (product) => product.active && product.category === category
    );
  }

  getProductsBySubcategory(subcategory: string): Product[] {
    return this.productsSource.value.filter(
      (product) => product.active && product.subcategory === subcategory
    );
  }

  /**
   * Live search suggestions for the header dropdown.
   * Requires at least 2 characters. Active products only.
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
    const products = this.productsSource.value.filter((p) => p.active);

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
  // PRIVATE — persistence
  // ============================================================

  /** Single door for catalog updates: memory + localStorage */
  private setProducts(products: Product[]): void {
    this.productsSource.next(products);
    this.saveProducts(products);
  }

  private loadProducts(): Product[] {
    const raw = localStorage.getItem(this.PRODUCTS_STORAGE_KEY);

    if (!raw) {
      return [...PRODUCTS];
    }

    try {
      const parsed = JSON.parse(raw) as Product[];

      if (!Array.isArray(parsed) || !parsed.length) {
        return [...PRODUCTS];
      }

      return parsed;
    } catch {
      return [...PRODUCTS];
    }
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Ensures subcategory belongs to the given category.
   * Prevents e.g. category: 'wigs' + subcategory: 'casual-dresses'.
   */
  private normalizeSubcategory(
    category: Category,
    subcategory?: string | null
  ): string | undefined {
    const slug = subcategory?.trim();

    if (!slug) {
      return undefined;
    }

    const isValid = SUBCATEGORIES.some(
      (sub) => sub.slug === slug && sub.category === category
    );

    return isValid ? slug : undefined;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private applyFilters(
    products: Product[],
    filters: ProductFilters
  ): Product[] {
    let result = products.filter((product) => product.active);

    if (filters.search?.trim()) {
      const term = filters.search.trim().toLowerCase();

      result = result.filter((product) =>
        this.matchesSearchTerm(product, term)
      );
    }

    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.subcategory) {
      result = result.filter(
        (product) => product.subcategory === filters.subcategory
      );
    }

    if (filters.brand) {
      result = result.filter(
        (product) =>
          product.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.rating != null) {
      result = result.filter((product) => product.rating >= filters.rating!);
    }

    if (filters.collection) {
      result = result.filter((product) =>
        product.collections?.some(
          (collection) => collection.slug === filters.collection
        )
      );
    }

    if (filters.minPrice != null) {
      result = result.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice != null) {
      result = result.filter((product) => product.price <= filters.maxPrice!);
    }

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
        break;
    }

    return result;
  }

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
        collection.slug.toLowerCase().includes(term)
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