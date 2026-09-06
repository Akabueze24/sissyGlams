import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { Product } from '../../models/product-models/product.model';
import { ProductFilters } from '../../models/product-models/product-filter.model';
import { Category } from '../../models/product-models/category.model';
import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { PRODUCTS } from '../../data/product';
import { StoreCollection } from '../../models/product-models/store-collection.model';
import { STORE_COLLECTIONS } from '../../models/product-models/store-collections';
import { CategoryService } from '../category-service/category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ============================================================
  // STORAGE
  // ============================================================

  private readonly PRODUCTS_STORAGE_KEY = 'sissy-dream-products';

  // ============================================================
  // STATE
  // ============================================================

  private productsSource = new BehaviorSubject<Product[]>(this.loadProducts());
  private filtersSource = new BehaviorSubject<ProductFilters>({});

  // ============================================================
  // PUBLIC OBSERVABLES
  // ============================================================

  products$ = this.productsSource.asObservable();
  filters$ = this.filtersSource.asObservable();

  /** Admin: every product */
  adminProducts$ = this.productsSource.asObservable();

  /** Shop: active + current filters */
  filteredProducts$: Observable<Product[]> = combineLatest([
    this.products$,
    this.filters$,
  ]).pipe(map(([products, filters]) => this.applyFilters(products, filters)));

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private categoryService: CategoryService) {}

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
  // ADMIN — products
  // ============================================================

  getAllProducts(): Product[] {
    return this.productsSource.value;
  }

  setProductActive(productId: string, active: boolean): void {
    const products = this.productsSource.value.map((product) =>
      product.id === productId ? { ...product, active } : product
    );
    this.setProducts(products);
  }

  toggleProductActive(productId: string): void {
    const product = this.productsSource.value.find((p) => p.id === productId);
    if (!product) return;
    this.setProductActive(productId, !product.active);
  }

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
    stock?: number;
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
      stock: input.stock ?? 0,
      createdAt: new Date().toISOString(),
    };

    this.setProducts([product, ...this.productsSource.value]);
    return product;
  }

  updateProduct(productId: string, changes: Partial<Product>): Product | null {
    const current = this.productsSource.value.find((p) => p.id === productId);
    if (!current) return null;

    const name = changes.name?.trim() ?? current.name;
    const category = changes.category ?? current.category;

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

    this.setProducts(
      this.productsSource.value.map((p) => (p.id === productId ? updated : p))
    );

    return updated;
  }

  deleteProduct(productId: string): boolean {
    const exists = this.productsSource.value.some((p) => p.id === productId);
    if (!exists) return false;

    this.setProducts(
      this.productsSource.value.filter((p) => p.id !== productId)
    );
    return true;
  }

  // ============================================================
  // LOOKUPS
  // ============================================================

  getProductById(id: string): Product | undefined {
    return this.productsSource.value.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.productsSource.value.find((p) => p.slug === slug);
  }

  getProductsByCollection(collectionSlug: string): Product[] {
    return this.productsSource.value.filter(
      (p) =>
        p.active &&
        p.collections?.some((c) => c.slug === collectionSlug)
    );
  }

  getFeaturedProducts(limit: number = 8): Product[] {
    return this.getProductsByCollection('featured').slice(0, limit);
  }

  getOnSaleProducts(limit: number = 8): Product[] {
    return this.productsSource.value
      .filter(
        (p) =>
          p.active && p.oldPrice != null && p.oldPrice > p.price
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
      (p) => p.active && p.category === category
    );
  }

  getProductsBySubcategory(subcategory: string): Product[] {
    return this.productsSource.value.filter(
      (p) => p.active && p.subcategory === subcategory
    );
  }

  // ============================================================
  // STOCK
  // ============================================================

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  getAvailableStock(product: Product): number {
    return Math.max(0, product.stock);
  }

  clampQuantityToStock(product: Product, quantity: number): number {
    if (quantity < 1) return 0;
    return Math.min(quantity, this.getAvailableStock(product));
  }

  reduceStock(productId: string, quantity: number): boolean {
    if (quantity < 1) return false;

    const current = this.productsSource.value.find((p) => p.id === productId);
    if (!current || current.stock < quantity) return false;

    this.setProducts(
      this.productsSource.value.map((p) =>
        p.id === productId ? { ...p, stock: p.stock - quantity } : p
      )
    );
    return true;
  }

  restoreStock(productId: string, quantity: number): boolean {
    if (quantity < 1) return false;

    const current = this.productsSource.value.find((p) => p.id === productId);
    if (!current) return false;

    this.setProducts(
      this.productsSource.value.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      )
    );
    return true;
  }

  // ============================================================
  // SEARCH / PRICE / NAV / COLLECTIONS
  // ============================================================

  searchSuggestions(term: string, limit: number = 6): Product[] {
    const value = term.trim().toLowerCase();
    if (value.length < 2) return [];

    return this.applyFilters(this.productsSource.value, {
      search: value,
    }).slice(0, limit);
  }

  getPriceRange(): { min: number; max: number } {
    const products = this.productsSource.value.filter((p) => p.active);
    if (!products.length) return { min: 0, max: 100 };

    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }

  /** Delegates to CategoryService (single source of truth) */
  getCategoryNav(): CategoryNavItem[] {
    return this.categoryService.getCategoryNav();
  }

  getStoreCollections(): StoreCollection[] {
    return STORE_COLLECTIONS;
  }

  // ============================================================
  // PRIVATE — persistence
  // ============================================================

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

      return parsed.map((product) => ({
        ...product,
        stock: typeof product.stock === 'number' ? product.stock : 0,
      }));
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
   * Subcategory must exist under CategoryService for this category.
   */
  private normalizeSubcategory(
    category: Category,
    subcategory?: string | null
  ): string | undefined {
    const slug = subcategory?.trim();
    if (!slug) return undefined;

    const isValid = this.categoryService
      .getSubcategories()
      .some((sub) => sub.slug === slug && sub.category === category);

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
    let result = products.filter((p) => p.active);

    if (filters.search?.trim()) {
      const term = filters.search.trim().toLowerCase();
      result = result.filter((p) => this.matchesSearchTerm(p, term));
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.subcategory) {
      result = result.filter((p) => p.subcategory === filters.subcategory);
    }

    if (filters.brand) {
      result = result.filter(
        (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.rating != null) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }

    if (filters.collection) {
      result = result.filter((p) =>
        p.collections?.some((c) => c.slug === filters.collection)
      );
    }

    if (filters.minPrice != null) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice != null) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
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
      ? this.categoryService
          .getSubcategories()
          .find((sub) => sub.slug === product.subcategory)
      : undefined;

    const inSubcategory =
      !!product.subcategory &&
      (product.subcategory.toLowerCase().includes(term) ||
        !!subcategoryMeta?.name.toLowerCase().includes(term));

    const inCollections = !!product.collections?.some(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term)
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