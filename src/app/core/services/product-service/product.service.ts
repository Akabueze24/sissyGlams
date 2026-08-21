import { Injectable } from '@angular/core';

import { Product } from '../../models/product-models/product.model';
import { ProductFilters } from '../../models/product-models/product-filter.model';
import { Category } from '../../models/product-models/category.model';
import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { SUBCATEGORIES } from '../../models/product-models/subcategories.model';
import { PRODUCTS } from '../../data/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ============================================================
  // SOURCE OF TRUTH (mock for now)
  // ============================================================

  private readonly products: Product[] = PRODUCTS;

  // ============================================================
  // PUBLIC METHODS
  // ============================================================

  getProducts(filters?: ProductFilters): Product[] {
    let result = this.getActiveProducts();

    if (!filters) {
      return result;
    }

    if (filters.search?.trim()) {
      const term = filters.search.trim().toLowerCase();

      result = result.filter((product) => {
        const inName = product.name.toLowerCase().includes(term);
        const inBrand = product.brand.toLowerCase().includes(term);
        const inDescription = product.productDetails.description
          .toLowerCase()
          .includes(term);

        return inName || inBrand || inDescription;
      });
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

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((product) => product.slug === slug);
  }

  getProductsByCollection(collectionSlug: string): Product[] {
    return this.getActiveProducts().filter((product) =>
      product.collections?.some(
        (collection) => collection.slug === collectionSlug
      )
    );
  }

  getFeaturedProducts(limit: number = 8): Product[] {
    return this.getProductsByCollection('featured').slice(0, limit);
  }

  getRelatedProducts(product: Product, limit: number = 8): Product[] {
    const sameCategory = this.getActiveProducts().filter(
      (item) => item.id !== product.id && item.category === product.category
    );

    const sameSubcategory = sameCategory.filter(
      (item) => item.subcategory === product.subcategory
    );

    let pool =
      sameSubcategory.length >= limit ? sameSubcategory : sameCategory;

    if (pool.length < limit) {
      const others = this.getActiveProducts().filter(
        (item) =>
          item.id !== product.id && !pool.some((p) => p.id === item.id)
      );

      pool = [...pool, ...others];
    }

    return pool.slice(0, limit);
  }

  getProductsByCategory(category: Category): Product[] {
    return this.getActiveProducts().filter(
      (product) => product.category === category
    );
  }

  getProductsBySubcategory(subcategory: string): Product[] {
    return this.getActiveProducts().filter(
      (product) => product.subcategory === subcategory
    );
  }

  searchProducts(term: string): Product[] {
    return this.getProducts({ search: term });
  }

  /**
   * Builds the category navigation used by Header and Shop sidebar.
   */
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
      'collections',
      'ebooks',
    ];

    return categoryOrder.map((category) => ({
      category,
      label: this.formatCategoryLabel(category),
      subcategories: SUBCATEGORIES.filter((sub) => sub.category === category),
    }));
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private getActiveProducts(): Product[] {
    return this.products.filter((product) => product.active);
  }

  private formatCategoryLabel(category: Category): string {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}