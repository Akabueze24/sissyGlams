import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StoreCollection } from '../../models/product-models/store-collection.model';
import { STORE_COLLECTIONS } from '../../models/product-models/store-collections';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly STORAGE_KEY = 'sissy-dream-collections';

  private collectionsSource = new BehaviorSubject<StoreCollection[]>(
    this.loadCollections()
  );

  collections$ = this.collectionsSource.asObservable();

  // ============================================================
  // READ
  // ============================================================

  getCollections(): StoreCollection[] {
    return this.collectionsSource.value;
  }

  getBySlug(slug: string): StoreCollection | undefined {
    return this.collectionsSource.value.find((c) => c.slug === slug);
  }

  // ============================================================
  // CREATE
  // ============================================================

  /**
   * Adds a collection. Slug is generated once from the name and stays fixed.
   * Returns null if empty, invalid slug, or duplicate slug/name.
   */
  addCollection(name: string): StoreCollection | null {
    const trimmed = name.trim();
    if (!trimmed) {
      return null;
    }

    const slug = this.slugify(trimmed);
    if (!slug) {
      return null;
    }

    const exists = this.collectionsSource.value.some(
      (c) =>
        c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      return null;
    }

    const collection: StoreCollection = { name: trimmed, slug };
    this.setCollections([...this.collectionsSource.value, collection]);
    return collection;
  }

  // ============================================================
  // UPDATE (rename only — slug does not change)
  // ============================================================

  /**
   * Renames a collection. Slug stays the same so product.collections
   * and ?collection= URLs keep working.
   */
  updateCollection(slug: string, name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) {
      return false;
    }

    const exists = this.collectionsSource.value.some((c) => c.slug === slug);
    if (!exists) {
      return false;
    }

    const duplicateName = this.collectionsSource.value.some(
      (c) =>
        c.slug !== slug && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicateName) {
      return false;
    }

    this.setCollections(
      this.collectionsSource.value.map((c) =>
        c.slug === slug ? { ...c, name: trimmed } : c
      )
    );
    return true;
  }

  // ============================================================
  // DELETE
  // ============================================================

  /**
   * Removes a collection definition.
   * Admin UI should block this if any product still uses the slug.
   */
  deleteCollection(slug: string): void {
    this.setCollections(
      this.collectionsSource.value.filter((c) => c.slug !== slug)
    );
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private setCollections(list: StoreCollection[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.collectionsSource.next(list);
  }

  private loadCollections(): StoreCollection[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoreCollection[];
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {
        // fall through to seed
      }
    }
    return this.getSeedCollections();
  }

  /**
   * Themes from STORE_COLLECTIONS + merchandising tags used on products.
   */
  private getSeedCollections(): StoreCollection[] {
    const merchandising: StoreCollection[] = [
      { name: 'Featured', slug: 'featured' },
      { name: 'New Arrivals', slug: 'new-arrivals' },
      { name: 'Best Sellers', slug: 'best-sellers' },
    ];

    const bySlug = new Map<string, StoreCollection>();

    for (const c of [...merchandising, ...STORE_COLLECTIONS]) {
      if (!bySlug.has(c.slug)) {
        bySlug.set(c.slug, c);
      }
    }

    return [...bySlug.values()];
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}