import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/core/models/product-models/product.model';

import { ProductService } from 'src/app/core/services/product-service/product.service';
import { CategoryService } from 'src/app/core/services/category-service/category.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';

export interface CategoryRow {
  category: string;
  label: string;
  subcategories: {
    name: string;
    slug: string;
  }[];
  productCount: number;
}

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  // ============================================================
  // CACHED LIST (avoid getters that rebuild on every CD cycle)
  // ============================================================

  products: Product[] = [];
  rows: CategoryRow[] = [];
  filteredRows: CategoryRow[] = [];

  searchTerm = '';
  statusFilter: '' | 'with-products' | 'empty' = '';

  totalCategories = 0;
  totalSubcategories = 0;
  categorizedProducts = 0;
  emptyCategories = 0;

  // ============================================================
  // ADD CATEGORY
  // ============================================================

  showAddForm = false;
  newCategoryLabel = '';
  pendingSubNames: string[] = [];
  pendingSubDraft = '';
  addError = '';

  // ============================================================
  // EDIT CATEGORY
  // ============================================================

  showEditModal = false;
  editingSlug: string | null = null;
  editLabel = '';
  editError = '';

  // ============================================================
  // VIEW CATEGORY / SUBCATEGORIES
  // ============================================================

  showViewModal = false;
  viewRow: CategoryRow | null = null;
  newSubcategoryName = '';
  subError = '';

  // ============================================================
  // EDIT SUBCATEGORY
  // ============================================================

  editingSubSlug: string | null = null;
  editingSubName = '';
  subEditError = '';

  // ============================================================
  // DELETE SUBCATEGORY
  // ============================================================

  showDeleteSubModal = false;
  subToDelete: { name: string; slug: string } | null = null;
  deleteSubError = '';

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  showDeleteCategoryModal = false;
  categoryToDelete: CategoryRow | null = null;
  deleteCategoryError = '';
  categoryDeleteError = '';

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private productsSubscription!: Subscription;
  private categoriesSubscription!: Subscription;
  private subcategoriesSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.productsSubscription = this.productService.adminProducts$.subscribe(
      (products) => {
        this.products = products;
        this.rebuildRows();
        this.refreshViewRow();
      }
    );

    this.categoriesSubscription = this.categoryService.categories$.subscribe(
      () => {
        this.rebuildRows();
        this.refreshViewRow();
      }
    );

    this.subcategoriesSubscription =
      this.categoryService.subcategories$.subscribe(() => {
        this.rebuildRows();
        this.refreshViewRow();
      });
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
    this.subcategoriesSubscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  // ============================================================
  // BUILD / FILTER (only when data or filters change)
  // ============================================================

  private rebuildRows(): void {
    this.rows = this.categoryService.getCategoryNav().map((item) => ({
      category: item.category,
      label: item.label,
      subcategories: item.subcategories.map((sub) => ({
        name: sub.name,
        slug: sub.slug,
      })),
      productCount: this.products.filter((p) => p.category === item.category)
        .length,
    }));

    this.applyLocalFilters();
    this.updateSummary();
  }

  private applyLocalFilters(): void {
    let list = [...this.rows];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      list = list.filter(
        (row) =>
          row.label.toLowerCase().includes(term) ||
          row.category.toLowerCase().includes(term) ||
          row.subcategories.some((sub) =>
            sub.name.toLowerCase().includes(term)
          )
      );
    }

    if (this.statusFilter === 'with-products') {
      list = list.filter((row) => row.productCount > 0);
    } else if (this.statusFilter === 'empty') {
      list = list.filter((row) => row.productCount === 0);
    }

    this.filteredRows = list;
  }

  private updateSummary(): void {
    this.totalCategories = this.rows.length;
    this.totalSubcategories = this.rows.reduce(
      (sum, row) => sum + row.subcategories.length,
      0
    );
    this.categorizedProducts = this.products.filter((p) => !!p.category)
      .length;
    this.emptyCategories = this.rows.filter((row) => row.productCount === 0)
      .length;
  }

  /** Call from template when search or status filter changes */
  onSearchOrFilterChange(): void {
    this.applyLocalFilters();
  }

  trackByCategory(_index: number, row: CategoryRow): string {
    return row.category;
  }

  trackBySub(_index: number, sub: { slug: string }): string {
    return sub.slug;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  isEmpty(row: CategoryRow): boolean {
    return row.productCount === 0;
  }

  countProductsUsingSub(subSlug: string): number {
    return this.products.filter((p) => p.subcategory === subSlug).length;
  }

  // ============================================================
  // ADD CATEGORY
  // ============================================================

  openAddForm(): void {
    this.closeEditModal();
    this.closeViewModal();
    this.closeDeleteSubModal();
    this.closeDeleteCategoryModal();

    this.showAddForm = true;
    this.newCategoryLabel = '';
    this.pendingSubNames = [];
    this.pendingSubDraft = '';
    this.addError = '';
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.newCategoryLabel = '';
    this.pendingSubNames = [];
    this.pendingSubDraft = '';
    this.addError = '';
  }

  addPendingSubcategory(): void {
    const name = this.pendingSubDraft.trim();
    if (!name) {
      return;
    }

    const exists = this.pendingSubNames.some(
      (n) => n.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return;
    }

    this.pendingSubNames = [...this.pendingSubNames, name];
    this.pendingSubDraft = '';
  }

  removePendingSubcategory(index: number): void {
    this.pendingSubNames = this.pendingSubNames.filter((_, i) => i !== index);
  }

  submitAddCategory(): void {
    this.addError = '';

    if (this.pendingSubDraft.trim()) {
      this.addPendingSubcategory();
    }

    const created = this.categoryService.addCategory(this.newCategoryLabel);

    if (!created) {
      this.addError =
        'Could not add category. Check that the name is not empty or already used.';
      return;
    }

    for (const name of this.pendingSubNames) {
      this.categoryService.addSubcategory(created.slug, name);
    }

    // subscriptions will rebuildRows via categories$/subcategories$
    this.closeAddForm();
    this.toastService.success(
      `Category "${created.label}" created successfully.`
    );

    const row = this.rows.find((r) => r.category === created.slug);
    if (row) {
      this.openViewModal(row);
    }
  }

  // ============================================================
  // EDIT CATEGORY
  // ============================================================

  openEditModal(row: CategoryRow): void {
    this.closeAddForm();
    this.closeViewModal();
    this.closeDeleteSubModal();
    this.closeDeleteCategoryModal();

    this.editingSlug = row.category;
    this.editLabel = row.label;
    this.editError = '';
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSlug = null;
    this.editLabel = '';
    this.editError = '';
    document.body.style.overflow = '';
  }

  submitEditCategory(): void {
    if (!this.editingSlug) {
      return;
    }

    this.editError = '';

    const ok = this.categoryService.updateCategory(
      this.editingSlug,
      this.editLabel
    );

    if (!ok) {
      this.editError =
        'Could not update. Name cannot be empty or already used.';
      return;
    }

    this.closeEditModal();
    this.toastService.success('Category name updated successfully.');
  }

  // ============================================================
  // VIEW CATEGORY
  // ============================================================

  openViewModal(row: CategoryRow): void {
    this.closeAddForm();
    this.closeEditModal();
    this.closeDeleteSubModal();
    this.closeDeleteCategoryModal();

    this.viewRow = this.rows.find((r) => r.category === row.category) ?? row;
    this.newSubcategoryName = '';
    this.subError = '';
    this.cancelEditSubcategory();
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.closeDeleteSubModal();
    this.showViewModal = false;
    this.viewRow = null;
    this.newSubcategoryName = '';
    this.subError = '';
    this.cancelEditSubcategory();
    document.body.style.overflow = '';
  }

  // ============================================================
  // ADD SUBCATEGORY
  // ============================================================

  submitAddSubcategory(): void {
    if (!this.viewRow) {
      return;
    }

    this.subError = '';

    const created = this.categoryService.addSubcategory(
      this.viewRow.category,
      this.newSubcategoryName
    );

    if (!created) {
      this.subError =
        'Could not add subcategory. Check that the name is not empty or already used.';
      return;
    }

    this.newSubcategoryName = '';
    this.toastService.success(
      `Subcategory "${created.name}" added successfully.`
    );
    // rebuild + refreshViewRow via subcategories$ subscription
  }

  // ============================================================
  // EDIT SUBCATEGORY
  // ============================================================

  startEditSubcategory(sub: { name: string; slug: string }): void {
    this.editingSubSlug = sub.slug;
    this.editingSubName = sub.name;
    this.subEditError = '';
    this.subError = '';
  }

  cancelEditSubcategory(): void {
    this.editingSubSlug = null;
    this.editingSubName = '';
    this.subEditError = '';
  }

  submitEditSubcategory(): void {
    if (!this.viewRow || !this.editingSubSlug) {
      return;
    }

    this.subEditError = '';

    const ok = this.categoryService.updateSubcategory(
      this.viewRow.category,
      this.editingSubSlug,
      this.editingSubName
    );

    if (!ok) {
      this.subEditError =
        'Could not update subcategory. Check that the name is not empty or already used.';
      return;
    }

    this.cancelEditSubcategory();
    this.toastService.success('Subcategory updated successfully.');
  }

  // ============================================================
  // DELETE SUBCATEGORY
  // ============================================================

  openDeleteSubModal(sub: { name: string; slug: string }): void {
    this.subError = '';
    this.deleteSubError = '';

    const used = this.countProductsUsingSub(sub.slug);
    if (used > 0) {
      this.subError = `Cannot delete "${sub.name}" — ${used} product(s) still use it.`;
      return;
    }

    this.subToDelete = sub;
    this.showDeleteSubModal = true;
  }

  closeDeleteSubModal(): void {
    this.showDeleteSubModal = false;
    this.subToDelete = null;
    this.deleteSubError = '';
  }

  confirmDeleteSubcategory(): void {
    if (!this.viewRow || !this.subToDelete) {
      return;
    }

    const used = this.countProductsUsingSub(this.subToDelete.slug);
    if (used > 0) {
      this.deleteSubError = `Cannot delete — ${used} product(s) still use this subcategory.`;
      return;
    }

    const name = this.subToDelete.name;

    this.categoryService.deleteSubcategory(
      this.viewRow.category,
      this.subToDelete.slug
    );

    this.closeDeleteSubModal();
    this.toastService.success(`Subcategory "${name}" deleted successfully.`);
  }

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  openDeleteCategoryModal(row: CategoryRow): void {
    this.categoryDeleteError = '';
    this.deleteCategoryError = '';

    if (row.productCount > 0) {
      this.categoryDeleteError = `Cannot delete "${row.label}" — ${row.productCount} product(s) still use this category.`;
      return;
    }

    this.categoryToDelete = row;
    this.showDeleteCategoryModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteCategoryModal(): void {
    this.showDeleteCategoryModal = false;
    this.categoryToDelete = null;
    this.deleteCategoryError = '';
    document.body.style.overflow = '';
  }

  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) {
      return;
    }

    const live = this.rows.find(
      (row) => row.category === this.categoryToDelete!.category
    );
    const count = live?.productCount ?? this.categoryToDelete.productCount;

    if (count > 0) {
      this.deleteCategoryError = `Cannot delete — ${count} product(s) still use this category.`;
      return;
    }

    const label = this.categoryToDelete.label;
    const slug = this.categoryToDelete.category;

    this.categoryService.deleteCategory(slug);
    this.closeDeleteCategoryModal();
    this.toastService.success(`Category "${label}" deleted successfully.`);
  }

  // ============================================================
  // REFRESH OPEN VIEW PANEL
  // ============================================================

  private refreshViewRow(): void {
    if (!this.viewRow) {
      return;
    }

    const next = this.rows.find((row) => row.category === this.viewRow!.category);

    if (!next) {
      this.closeViewModal();
      return;
    }

    this.viewRow = next;
  }
}