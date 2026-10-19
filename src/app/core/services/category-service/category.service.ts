import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CategoryNavItem } from '../../models/product-models/category-nav-item.model';
import { Subcategory } from '../../models/product-models/subcategory.model';
import { CategoryDefinition } from '../../models/admin-model/category-definition.model';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  private categoriesSource = new BehaviorSubject<CategoryDefinition[]>([]);
  private subcategoriesSource = new BehaviorSubject<Subcategory[]>([]);

  categories$ = this.categoriesSource.asObservable();
  subcategories$ = this.subcategoriesSource.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  // ============================================================
  // LOAD
  // ============================================================

  loadCategoriesFromApi(): void {
    this.http.get<CategoryNavItem[]>(this.apiUrl).subscribe({
      next: (nav) => this.applyNavFromApi(nav ?? []),
      error: (err) => {
        console.error('Failed to load categories', err);
        this.toastService.error(
          this.readError(err, 'Could not load categories.'),
        );
      },
    });
  }

  private applyNavFromApi(nav: CategoryNavItem[]): void {
    const categories: CategoryDefinition[] = nav.map((item) => ({
      slug: item.category,
      label: item.label,
    }));

    const subcategories: Subcategory[] = nav.flatMap((item) =>
      (item.subcategories ?? []).map((sub) => ({
        name: sub.name,
        slug: sub.slug,
        category: sub.category || item.category,
      })),
    );

    this.categoriesSource.next(categories);
    this.subcategoriesSource.next(subcategories);
  }

  // ============================================================
  // READ (sync — from in-memory state filled by API)
  // ============================================================

  getCategoryNav(): CategoryNavItem[] {
    const subs = this.subcategoriesSource.value;

    return this.categoriesSource.value.map((category) => ({
      category: category.slug,
      label: category.label,
      subcategories: subs.filter((s) => s.category === category.slug),
    }));
  }

  getCategories(): CategoryDefinition[] {
    return this.categoriesSource.value;
  }

  getSubcategories(): Subcategory[] {
    return this.subcategoriesSource.value;
  }

  getSubcategoriesByCategory(categorySlug: string): Subcategory[] {
    return this.subcategoriesSource.value.filter(
      (s) => s.category === categorySlug,
    );
  }

  // ============================================================
  // CATEGORY — CREATE / UPDATE / DELETE
  // ============================================================

  /**
   * POST /api/categories  { label }
   */
  addCategory(label: string, pendingSubNames: string[] = []): void {
    const trimmed = label.trim();
    if (!trimmed) {
      this.toastService.error('Category name is required.');
      return;
    }

    this.http
      .post<{ category: string; label: string }>(this.apiUrl, {
        label: trimmed,
      })
      .subscribe({
        next: (created) => {
          // Create optional subcategories, then refresh once at the end
          if (!pendingSubNames.length) {
            this.toastService.success(
              `Category "${created.label}" created successfully.`,
            );
            this.loadCategoriesFromApi();
            return;
          }

          let remaining = pendingSubNames.length;
          let failed = 0;

          for (const name of pendingSubNames) {
            this.http
              .post(`${this.apiUrl}/${created.category}/subcategories`, {
                name: name.trim(),
              })
              .subscribe({
                next: () => {
                  remaining--;
                  if (remaining === 0) {
                    if (failed) {
                      this.toastService.error(
                        'Category created, but some subcategories failed.',
                      );
                    } else {
                      this.toastService.success(
                        `Category "${created.label}" created successfully.`,
                      );
                    }
                    this.loadCategoriesFromApi();
                  }
                },
                error: (err) => {
                  failed++;
                  remaining--;
                  console.error(err);
                  if (remaining === 0) {
                    this.toastService.error(
                      this.readError(
                        err,
                        'Category created, but some subcategories failed.',
                      ),
                    );
                    this.loadCategoriesFromApi();
                  }
                },
              });
          }
        },
        error: (err) => {
          this.toastService.error(
            this.readError(err, 'Could not create category.'),
          );
        },
      });
  }

  /**
   * PUT /api/categories/:slug  { label }
   */
  updateCategory(slug: string, label: string): void {
    const trimmed = label.trim();
    if (!trimmed) {
      this.toastService.error('Category name is required.');
      return;
    }

    this.http.put(`${this.apiUrl}/${slug}`, { label: trimmed }).subscribe({
      next: () => {
        this.toastService.success('Category name updated successfully.');
        this.loadCategoriesFromApi();
      },
      error: (err) => {
        this.toastService.error(
          this.readError(err, 'Could not update category.'),
        );
      },
    });
  }

  /**
   * DELETE /api/categories/:slug
   */
  deleteCategory(slug: string): void {
    this.http.delete(`${this.apiUrl}/${slug}`).subscribe({
      next: () => {
        this.toastService.success('Category deleted successfully.');
        this.loadCategoriesFromApi();
      },
      error: (err) => {
        this.toastService.error(
          this.readError(err, 'Could not delete category.'),
        );
      },
    });
  }

  // ============================================================
  // SUBCATEGORY — CREATE / UPDATE / DELETE
  // ============================================================

  /**
   * POST /api/categories/:slug/subcategories  { name }
   */
  addSubcategory(categorySlug: string, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.toastService.error('Subcategory name is required.');
      return;
    }

    this.http
      .post(`${this.apiUrl}/${categorySlug}/subcategories`, { name: trimmed })
      .subscribe({
        next: () => {
          this.toastService.success(
            `Subcategory "${trimmed}" added successfully.`,
          );
          this.loadCategoriesFromApi();
        },
        error: (err) => {
          this.toastService.error(
            this.readError(err, 'Could not add subcategory.'),
          );
        },
      });
  }

  /**
   * PUT /api/categories/:slug/subcategories/:subSlug  { name }
   */
  updateSubcategory(
    categorySlug: string,
    subSlug: string,
    name: string,
  ): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.toastService.error('Subcategory name is required.');
      return;
    }

    this.http
      .put(`${this.apiUrl}/${categorySlug}/subcategories/${subSlug}`, {
        name: trimmed,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Subcategory updated successfully.');
          this.loadCategoriesFromApi();
        },
        error: (err) => {
          this.toastService.error(
            this.readError(err, 'Could not update subcategory.'),
          );
        },
      });
  }

  /**
   * DELETE /api/categories/:slug/subcategories/:subSlug
   */
  deleteSubcategory(categorySlug: string, subSlug: string): void {
    this.http
      .delete(`${this.apiUrl}/${categorySlug}/subcategories/${subSlug}`)
      .subscribe({
        next: () => {
          this.toastService.success('Subcategory deleted successfully.');
          this.loadCategoriesFromApi();
        },
        error: (err) => {
          this.toastService.error(
            this.readError(err, 'Could not delete subcategory.'),
          );
        },
      });
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private readError(err: unknown, fallback: string): string {
    const e = err as { error?: { message?: string }; message?: string };
    return e?.error?.message || e?.message || fallback;
  }
}