import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { Subcategory } from '../../models/product-models/subcategory.model';
import { SUBCATEGORIES } from '../../models/product-models/subcategories.model';
import { CategoryDefinition } from '../../models/admin-model/category-definition.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // ============================================================
  // STORAGE
  // ============================================================

  private readonly CATEGORIES_KEY = 'sissy-dream-categories';
  private readonly SUBCATEGORIES_KEY = 'sissy-dream-subcategories';

  // ============================================================
  // STATE
  // ============================================================

  private categoriesSource = new BehaviorSubject<CategoryDefinition[]>(
    this.loadCategories(),
  );

  private subcategoriesSource = new BehaviorSubject<Subcategory[]>(
    this.loadSubcategories(),
  );

  categories$ = this.categoriesSource.asObservable();
  subcategories$ = this.subcategoriesSource.asObservable();

  // ============================================================
  // READ
  // ============================================================

  /**
   * Returns the complete category navigation tree.
   *
   * Each category contains:
   * - category slug
   * - category label
   * - its subcategories
   */
  getCategoryNav(): CategoryNavItem[] {
    const subs = this.subcategoriesSource.value;

    return this.categoriesSource.value.map((category) => ({
      category: category.slug,
      label: category.label,
      subcategories: subs.filter(
        (subcategory) => subcategory.category === category.slug,
      ),
    }));
  }

  /**
   * Returns all categories.
   */
  getCategories(): CategoryDefinition[] {
    return this.categoriesSource.value;
  }

  /**
   * Returns all subcategories.
   */
  getSubcategories(): Subcategory[] {
    return this.subcategoriesSource.value;
  }

  /**
   * Returns all subcategories belonging to a category.
   */
  getSubcategoriesByCategory(categorySlug: string): Subcategory[] {
    return this.subcategoriesSource.value.filter(
      (subcategory) => subcategory.category === categorySlug,
    );
  }

  // ============================================================
  // CATEGORIES — CREATE / UPDATE / DELETE
  // ============================================================

  /**
   * Creates a new top-level category.
   *
   * Example:
   * "Make Up" → "make-up"
   *
   * The generated slug becomes the permanent identifier
   * for the category.
   *
   * Returns null if:
   * - name is empty
   * - slug cannot be generated
   * - category already exists
   */
  addCategory(label: string): CategoryDefinition | null {
    const trimmed = label.trim();

    if (!trimmed) {
      return null;
    }

    const slug = this.slugify(trimmed);

    if (!slug) {
      return null;
    }

    const exists = this.categoriesSource.value.some(
      (category) => category.slug === slug,
    );

    if (exists) {
      return null;
    }

    const category: CategoryDefinition = {
      slug,
      label: trimmed,
    };

    this.setCategories([...this.categoriesSource.value, category]);

    return category;
  }

  /**
   * Renames an existing category.
   *
   * IMPORTANT:
   * The slug does NOT change.
   *
   * Example:
   *
   * Before:
   * label = "Make Up"
   * slug  = "make-up"
   *
   * After:
   * label = "Beauty"
   * slug  = "make-up"
   *
   * Keeping the slug prevents existing products from losing
   * their category reference.
   */
  updateCategory(slug: string, label: string): boolean {
    const trimmed = label.trim();

    if (!trimmed) {
      return false;
    }

    const exists = this.categoriesSource.value.some(
      (category) => category.slug === slug,
    );

    if (!exists) {
      return false;
    }

    const duplicateLabel = this.categoriesSource.value.some(
      (category) =>
        category.slug !== slug &&
        category.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicateLabel) {
      return false;
    }

    this.setCategories(
      this.categoriesSource.value.map((category) =>
        category.slug === slug
          ? {
              ...category,
              label: trimmed,
            }
          : category,
      ),
    );

    return true;
  }

  /**
   * Deletes a category and all of its subcategories.
   *
   * The Admin Categories component is responsible for checking
   * whether products still use the category before calling this.
   */
  deleteCategory(slug: string): void {
    this.setCategories(
      this.categoriesSource.value.filter((category) => category.slug !== slug),
    );

    this.setSubcategories(
      this.subcategoriesSource.value.filter(
        (subcategory) => subcategory.category !== slug,
      ),
    );
  }

  // ============================================================
  // SUBCATEGORIES — CREATE / UPDATE / DELETE
  // ============================================================

  /**
   * Creates a new subcategory.
   *
   * Example:
   *
   * "Fish Net"
   *     ↓
   * "fish-net"
   *
   * The generated slug is saved with the subcategory and
   * becomes its permanent identifier.
   */
  addSubcategory(categorySlug: string, name: string): Subcategory | null {
    const trimmed = name.trim();

    if (!trimmed) {
      return null;
    }

    // Make sure the parent category exists.
    const parentExists = this.categoriesSource.value.some(
      (category) => category.slug === categorySlug,
    );

    if (!parentExists) {
      return null;
    }

    // Generate slug ONLY when creating a new subcategory.
    const slug = this.slugify(trimmed);

    if (!slug) {
      return null;
    }

    // Prevent duplicate subcategory slugs in the same category.
    const slugExists = this.subcategoriesSource.value.some(
      (subcategory) =>
        subcategory.category === categorySlug && subcategory.slug === slug,
    );

    if (slugExists) {
      return null;
    }

    // Also prevent duplicate names in the same category.
    const nameExists = this.subcategoriesSource.value.some(
      (subcategory) =>
        subcategory.category === categorySlug &&
        subcategory.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (nameExists) {
      return null;
    }

    const subcategory: Subcategory = {
      name: trimmed,
      slug,
      category: categorySlug,
    };

    this.setSubcategories([...this.subcategoriesSource.value, subcategory]);

    return subcategory;
  }

  /**
   * Renames an existing subcategory.
   *
   * IMPORTANT:
   * The slug DOES NOT change.
   *
   * Example:
   *
   * Before:
   * name = "Fish Net"
   * slug = "fish-net"
   *
   * Rename to:
   * "Fishnet Stockings"
   *
   * After:
   * name = "Fishnet Stockings"
   * slug = "fish-net"
   *
   * This keeps existing products connected to the
   * subcategory.
   */
  updateSubcategory(
    categorySlug: string,
    oldSlug: string,
    name: string,
  ): boolean {
    const trimmed = name.trim();

    if (!trimmed) {
      return false;
    }

    // Make sure the subcategory exists.
    const exists = this.subcategoriesSource.value.some(
      (subcategory) =>
        subcategory.category === categorySlug && subcategory.slug === oldSlug,
    );

    if (!exists) {
      return false;
    }

    // Prevent another subcategory in the same category
    // from having the same name.
    const duplicateName = this.subcategoriesSource.value.some(
      (subcategory) =>
        subcategory.category === categorySlug &&
        subcategory.slug !== oldSlug &&
        subcategory.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicateName) {
      return false;
    }

    // IMPORTANT:
    // We only change the name.
    // The old slug is intentionally preserved.
    this.setSubcategories(
      this.subcategoriesSource.value.map((subcategory) =>
        subcategory.category === categorySlug && subcategory.slug === oldSlug
          ? {
              ...subcategory,
              name: trimmed,
            }
          : subcategory,
      ),
    );

    return true;
  }

  /**
   * Deletes a subcategory.
   *
   * The Admin Categories component is responsible for checking
   * whether products still use this subcategory before calling
   * this method.
   */
  deleteSubcategory(categorySlug: string, slug: string): void {
    this.setSubcategories(
      this.subcategoriesSource.value.filter(
        (subcategory) =>
          !(subcategory.category === categorySlug && subcategory.slug === slug),
      ),
    );
  }

  // ============================================================
  // PRIVATE — PERSISTENCE
  // ============================================================

  /**
   * Saves categories to localStorage and updates the observable.
   */
  private setCategories(list: CategoryDefinition[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(list));

    this.categoriesSource.next(list);
  }

  /**
   * Saves subcategories to localStorage and updates the observable.
   */
  private setSubcategories(list: Subcategory[]): void {
    localStorage.setItem(this.SUBCATEGORIES_KEY, JSON.stringify(list));

    this.subcategoriesSource.next(list);
  }

  // ============================================================
  // LOAD — CATEGORIES
  // ============================================================

  /**
   * Loads categories from localStorage.
   *
   * If nothing is stored yet, the default seed categories
   * are returned.
   */
  private loadCategories(): CategoryDefinition[] {
    const raw = localStorage.getItem(this.CATEGORIES_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CategoryDefinition[];

        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {
        // Fall back to seed categories below.
      }
    }

    return this.getSeedCategories();
  }

  // ============================================================
  // LOAD — SUBCATEGORIES
  // ============================================================

  /**
   * Loads subcategories from localStorage.
   *
   * If nothing is stored yet, the default seed subcategories
   * are returned.
   */
  private loadSubcategories(): Subcategory[] {
    const raw = localStorage.getItem(this.SUBCATEGORIES_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Subcategory[];

        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {
        // Fall back to seed subcategories below.
      }
    }

    return [...SUBCATEGORIES];
  }

  // ============================================================
  // SEED CATEGORIES
  // ============================================================

  private getSeedCategories(): CategoryDefinition[] {
    return [
      { slug: 'dresses', label: 'Dresses' },
      { slug: 'wigs', label: 'Wigs' },
      { slug: 'lingerie', label: 'Lingerie' },
      { slug: 'shapers', label: 'Shapers' },
      { slug: 'shoes', label: 'Shoes' },
      { slug: 'tops', label: 'Tops' },
      { slug: 'bottoms', label: 'Bottoms' },
      { slug: 'sissy-toys', label: 'Sissy Toys' },
      { slug: 'make-up', label: 'Make Up' },
      { slug: 'accessories', label: 'Accessories' },
      { slug: 'ebooks', label: 'Ebooks' },
    ];
  }

  // ============================================================
  // SLUG
  // ============================================================

  /**
   * Converts a human-readable name into a URL/storage-friendly slug.
   *
   * Examples:
   *
   * "Fish Net"       → "fish-net"
   * "Evening Dress"  → "evening-dress"
   * "Sissy Toys"     → "sissy-toys"
   * "  Make Up  "    → "make-up"
   */
  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
