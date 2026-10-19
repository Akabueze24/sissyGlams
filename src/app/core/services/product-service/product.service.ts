import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';

import { Product } from '../../models/product-models/product.model';
import { ProductFilters } from '../../models/product-models/product-filter.model';
import { Category } from '../../models/product-models/category.model';
import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { StoreCollection } from '../../models/product-models/store-collection.model';
import { PRODUCTS } from '../../data/product';

import { CategoryService } from '../category-service/category.service';
import { CollectionService } from '../collection-service/collection.service';
import { ToastService } from '../toast-service/toast.service';

import { environment } from 'src/environments/environment';

export interface CreateProductInput {
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
  rating?: number;
  reviewCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly PRODUCTS_STORAGE_KEY = 'sissy-dream-products';

  private productsSource = new BehaviorSubject<Product[]>(this.loadProducts());
  private filtersSource = new BehaviorSubject<ProductFilters>({});

  products$ = this.productsSource.asObservable();
  filters$ = this.filtersSource.asObservable();
  adminProducts$ = this.productsSource.asObservable();

  filteredProducts$: Observable<Product[]> = combineLatest([
    this.products$,
    this.filters$,
  ]).pipe(map(([products, filters]) => this.applyFilters(products, filters)));

  constructor(
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private http: HttpClient,
    private toastService: ToastService,
  ) {
    this.loadProductsFromApi();
  }

  // ============================================================
  // API — LOAD
  // ============================================================

  loadProductsFromApi(): void {
    this.http.get<any[]>(`${environment.apiUrl}/products?all=true`).subscribe({
      next: (list) => {
        const mapped = (list ?? []).map((p) => this.mapApiProduct(p));
        this.productsSource.next(mapped);
      },
      error: (err) => {
        console.error('Failed to load products from API', err);
      },
    });
  }

  getProductBySlugFromApi(slug: string): Observable<Product | null> {
    return this.http
      .get<any>(`${environment.apiUrl}/products/${encodeURIComponent(slug)}`)
      .pipe(
        map((p) => this.mapApiProduct(p)),
        catchError((err) => {
          console.error('Failed to load product by slug', err);
          return of(null);
        }),
      );
  }

  // ============================================================
  // API — WRITE (admin)
  // ============================================================

  createProductOnApi(input: CreateProductInput): Observable<Product | null> {
    const name = input.name.trim();

    const body = {
      name,
      slug: this.slugify(name),
      brand: input.brand.trim(),
      category: input.category,
      subcategory: input.subcategory || undefined,
      collections: input.collections?.length ? input.collections : [],
      images: [input.imageUrl.trim()],
      price: input.price,
      productDetails: {
        description: input.description.trim(),
        details: [] as string[],
        shipping: 'Ships within 2–5 business days.',
        returns: 'Eligible for return according to store policy.',
      },
      rating: input.rating ?? 0,
      reviewCount: input.reviewCount ?? 0,
      active: input.active ?? true,
      stock: input.stock ?? 0,
    };

    return this.http.post<any>(`${environment.apiUrl}/products`, body).pipe(
      map((p) => this.mapApiProduct(p)),
      tap((product) => {
        this.productsSource.next([product, ...this.productsSource.value]);
        this.toastService.success('Product created successfully.');
      }),
      catchError((err) => {
        console.error('Failed to create product', err);
        this.toastService.error(
          err?.error?.message || 'Could not create product. Please try again.',
        );
        return of(null);
      }),
    );
  }

  updateProductOnApi(
    productId: string,
    changes: Partial<Product>,
  ): Observable<Product | null> {
    const body: Record<string, unknown> = { ...changes };
    delete body['id'];
    delete body['_id'];

    return this.http
      .put<any>(`${environment.apiUrl}/products/id/${productId}`, body)
      .pipe(
        map((p) => this.mapApiProduct(p)),
        tap((updated) => {
          this.productsSource.next(
            this.productsSource.value.map((item) =>
              item.id === productId ? updated : item,
            ),
          );
          this.toastService.success('Product updated successfully.');
        }),
        catchError((err) => {
          console.error('Failed to update product', err);
          this.toastService.error(
            err?.error?.message || 'Could not update product. Please try again.',
          );
          return of(null);
        }),
      );
  }

  deleteProductOnApi(productId: string): Observable<boolean> {
    return this.http
      .delete(`${environment.apiUrl}/products/id/${productId}`)
      .pipe(
        map(() => true),
        tap(() => {
          this.productsSource.next(
            this.productsSource.value.filter((p) => p.id !== productId),
          );
          this.toastService.success('Product deleted successfully.');
        }),
        catchError((err) => {
          console.error('Failed to delete product', err);
          this.toastService.error(
            err?.error?.message || 'Could not delete product. Please try again.',
          );
          return of(false);
        }),
      );
  }

  toggleProductActive(productId: string): void {
    const product = this.productsSource.value.find((p) => p.id === productId);
    if (!product) {
      return;
    }

    this.updateProductOnApi(productId, { active: !product.active }).subscribe();
  }

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
  // LOOKUPS (in-memory — filled from API)
  // ============================================================

  getAllProducts(): Product[] {
    return this.productsSource.value;
  }

  getProductById(id: string): Product | undefined {
    return this.productsSource.value.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.productsSource.value.find((p) => p.slug === slug);
  }

  getProductsByCollection(collectionSlug: string): Product[] {
    return this.productsSource.value.filter(
      (p) =>
        p.active && p.collections?.some((c) => c.slug === collectionSlug),
    );
  }

  getFeaturedProducts(limit: number = 8): Product[] {
    return this.getProductsByCollection('featured').slice(0, limit);
  }

  getOnSaleProducts(limit: number = 8): Product[] {
    return this.productsSource.value
      .filter((p) => p.active && p.oldPrice != null && p.oldPrice > p.price)
      .slice(0, limit);
  }

  getRelatedProducts(product: Product, limit: number = 8): Product[] {
    const sameCategory = this.productsSource.value.filter(
      (item) =>
        item.active &&
        item.id !== product.id &&
        item.category === product.category,
    );

    const sameSubcategory = sameCategory.filter(
      (item) => item.subcategory === product.subcategory,
    );

    let pool =
      sameSubcategory.length >= limit ? sameSubcategory : sameCategory;

    if (pool.length < limit) {
      const others = this.productsSource.value.filter(
        (item) =>
          item.active &&
          item.id !== product.id &&
          !pool.some((p) => p.id === item.id),
      );
      pool = [...pool, ...others];
    }

    return pool.slice(0, limit);
  }

  getProductsByCategory(category: Category): Product[] {
    return this.productsSource.value.filter(
      (p) => p.active && p.category === category,
    );
  }

  getProductsBySubcategory(subcategory: string): Product[] {
    return this.productsSource.value.filter(
      (p) => p.active && p.subcategory === subcategory,
    );
  }

  // ============================================================
  // STOCK (in-memory until stock is fully owned by the API)
  // ============================================================

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  getAvailableStock(product: Product): number {
    return Math.max(0, product.stock);
  }

  clampQuantityToStock(product: Product, quantity: number): number {
    if (quantity < 1) {
      return 0;
    }
    return Math.min(quantity, this.getAvailableStock(product));
  }

  reduceStock(productId: string, quantity: number): boolean {
    if (quantity < 1) {
      return false;
    }

    const current = this.productsSource.value.find((p) => p.id === productId);
    if (!current || current.stock < quantity) {
      return false;
    }

    this.patchLocalProducts(
      this.productsSource.value.map((p) =>
        p.id === productId ? { ...p, stock: p.stock - quantity } : p,
      ),
    );
    return true;
  }

  restoreStock(productId: string, quantity: number): boolean {
    if (quantity < 1) {
      return false;
    }

    const current = this.productsSource.value.find((p) => p.id === productId);
    if (!current) {
      return false;
    }

    this.patchLocalProducts(
      this.productsSource.value.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p,
      ),
    );
    return true;
  }

  // ============================================================
  // SEARCH / PRICE / NAV
  // ============================================================

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

    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }

  getCategoryNav(): CategoryNavItem[] {
    return this.categoryService.getCategoryNav();
  }

  getStoreCollections(): StoreCollection[] {
    return this.collectionService.getCollections();
  }

  // ============================================================
  // PRIVATE — API mapping
  // ============================================================

  private mapApiProduct(p: any): Product {
    return {
      id: p.id || p._id,
      name: p.name,
      slug: p.slug,
      brand: p.brand ?? '',
      category: p.category,
      subcategory: p.subcategory,
      collections: p.collections ?? [],
      images: p.images?.length
        ? p.images
        : ['https://placehold.co/400x500?text=Product'],
      price: p.price,
      oldPrice: p.oldPrice,
      productDetails: {
        description: p.productDetails?.description ?? '',
        details: p.productDetails?.details ?? [],
        shipping: p.productDetails?.shipping ?? '',
        returns: p.productDetails?.returns ?? '',
      },
      colors: p.colors ?? [],
      colorGalleries: p.colorGalleries ?? [],
      sizes: p.sizes ?? [],
      lengths: p.lengths ?? [],
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      stock: typeof p.stock === 'number' ? p.stock : 0,
      active: p.active !== false,
      createdAt: p.createdAt
        ? new Date(p.createdAt).toISOString()
        : undefined,
    };
  }

  // ============================================================
  // PRIVATE — local list (stock + brief fallback before API loads)
  // ============================================================

  private patchLocalProducts(products: Product[]): void {
    this.productsSource.value;
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
  // PRIVATE — filters / helpers
  // ============================================================

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private applyFilters(
    products: Product[],
    filters: ProductFilters,
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
        (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase(),
      );
    }

    if (filters.rating != null) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }

    if (filters.collection) {
      result = result.filter((p) =>
        p.collections?.some((c) => c.slug === filters.collection),
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
        c.slug.toLowerCase().includes(term),
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