import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { Product } from 'src/app/core/models/product-models/product.model';
import { StoreCollection } from 'src/app/core/models/product-models/store-collection.model';
import { CollectionService } from 'src/app/core/services/collection-service/collection.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';
import { PaginationService } from 'src/app/core/services/pagination-service/pagination.service';

/** Table / modal row: catalog collection + live product count */
export interface CollectionRow {
  name: string;
  slug: string;
  productCount: number;
}

@Component({
  selector: 'app-admin-collection',
  templateUrl: './admin-collection.component.html',
  styleUrls: ['./admin-collection.component.scss'],
})
export class AdminCollectionComponent implements OnInit, OnDestroy {
  // ============================================================
  // LIST
  // ============================================================

  rows: CollectionRow[] = [];
  filteredRows: CollectionRow[] = [];

  searchTerm = '';
  statusFilter: '' | 'with-products' | 'empty' = '';

  totalCollections = 0;
  withProductsCount = 0;
  emptyCollectionsCount = 0;
  /** Distinct products that have at least one collection */
  productsInCollectionsCount = 0;

  // ============================================================
  // PAGINATION (Option A — local state + shared helpers)
  // ============================================================

  currentPage = 1;
  pageSize = 10;

  // ============================================================
  // ADD
  // ============================================================

  showAddForm = false;
  newCollectionName = '';
  addError = '';

  // ============================================================
  // EDIT
  // ============================================================

  showEditModal = false;
  editingSlug: string | null = null;
  editName = '';
  editError = '';

  // ============================================================
  // VIEW
  // ============================================================

  showViewModal = false;
  selectedRow: CollectionRow | null = null;
  viewProducts: Product[] = [];

  // ============================================================
  // DELETE
  // ============================================================

  showDeleteModal = false;
  rowToDelete: CollectionRow | null = null;
  deleteError = '';

  private products: Product[] = [];
  private sub!: Subscription;

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private toastService: ToastService,
    private pagination: PaginationService
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.sub = combineLatest([
      this.collectionService.collections$,
      this.productService.adminProducts$,
    ]).subscribe(([collections, products]) => {
      this.products = products;
      this.rebuildRows(collections);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    document.body.style.overflow = '';
  }

  // ============================================================
  // BUILD ROWS
  // ============================================================

  private rebuildRows(collections: StoreCollection[]): void {
    this.rows = collections.map((c) => ({
      name: c.name,
      slug: c.slug,
      productCount: this.products.filter((p) =>
        p.collections?.some((pc) => pc.slug === c.slug)
      ).length,
    }));

    this.totalCollections = this.rows.length;
    this.withProductsCount = this.rows.filter((r) => r.productCount > 0).length;
    this.emptyCollectionsCount = this.rows.filter(
      (r) => r.productCount === 0
    ).length;

    const tagged = new Set<string>();
    for (const p of this.products) {
      if (p.collections?.length) {
        tagged.add(p.id);
      }
    }
    this.productsInCollectionsCount = tagged.size;

    this.applyFilters();

    if (this.selectedRow) {
      const updated = this.rows.find((r) => r.slug === this.selectedRow!.slug);
      if (updated) {
        this.selectedRow = updated;
        this.viewProducts = this.getProductsForSlug(updated.slug);
      } else {
        this.closeViewModal();
      }
    }

    if (this.rowToDelete) {
      const updated = this.rows.find((r) => r.slug === this.rowToDelete!.slug);
      if (updated) {
        this.rowToDelete = updated;
      } else {
        this.closeDeleteModal();
      }
    }
  }

  private getProductsForSlug(slug: string): Product[] {
    return this.products.filter((p) =>
      p.collections?.some((c) => c.slug === slug)
    );
  }

  // ============================================================
  // FILTER
  // ============================================================

  onSearchOrFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let list = [...this.rows];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.slug.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter === 'with-products') {
      list = list.filter((r) => r.productCount > 0);
    } else if (this.statusFilter === 'empty') {
      list = list.filter((r) => r.productCount === 0);
    }

    this.filteredRows = list;

    this.currentPage = this.pagination.clampPage(
      this.currentPage,
      this.filteredRows.length,
      this.pageSize
    );
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  get pagedRows(): CollectionRow[] {
    return this.pagination.slicePage(
      this.filteredRows,
      this.currentPage,
      this.pageSize
    );
  }

  get pageRangeStart(): number {
    return this.pagination.rangeStart(
      this.currentPage,
      this.pageSize,
      this.filteredRows.length
    );
  }

  get pageRangeEnd(): number {
    return this.pagination.rangeEnd(
      this.currentPage,
      this.pageSize,
      this.filteredRows.length
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  trackBySlug(_index: number, row: CollectionRow): string {
    return row.slug;
  }

  /** Live slug preview for add form */
  get previewSlug(): string {
    return this.slugifyPreview(this.newCollectionName);
  }

  private slugifyPreview(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ============================================================
  // ADD
  // ============================================================

  openAddForm(): void {
    this.showAddForm = true;
    this.newCollectionName = '';
    this.addError = '';
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.newCollectionName = '';
    this.addError = '';
  }

  submitAddCollection(): void {
    this.addError = '';
    const created = this.collectionService.addCollection(this.newCollectionName);

    if (!created) {
      this.addError =
        'Could not add. Check the name is not empty or already used.';
      return;
    }

    this.toastService.success(`Collection "${created.name}" created.`);
    this.closeAddForm();
  }

  // ============================================================
  // EDIT
  // ============================================================

  openEditModal(row: CollectionRow): void {
    this.closeViewModal();
    this.editingSlug = row.slug;
    this.editName = row.name;
    this.editError = '';
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSlug = null;
    this.editName = '';
    this.editError = '';
    document.body.style.overflow = '';
  }

  submitEditCollection(): void {
    if (!this.editingSlug) {
      return;
    }

    this.editError = '';
    const ok = this.collectionService.updateCollection(
      this.editingSlug,
      this.editName
    );

    if (!ok) {
      this.editError = 'Could not update. Name cannot be empty or duplicated.';
      return;
    }

    this.toastService.success('Collection name updated.');
    this.closeEditModal();
  }

  // ============================================================
  // VIEW
  // ============================================================

  openViewModal(row: CollectionRow): void {
    this.selectedRow = row;
    this.viewProducts = this.getProductsForSlug(row.slug);
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedRow = null;
    this.viewProducts = [];
    document.body.style.overflow = '';
  }

  // ============================================================
  // DELETE
  // ============================================================

  openDeleteModal(row: CollectionRow): void {
    this.rowToDelete = row;
    this.deleteError = '';
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.rowToDelete = null;
    this.deleteError = '';
    document.body.style.overflow = '';
  }

  confirmDeleteCollection(): void {
    if (!this.rowToDelete) {
      return;
    }

    if (this.rowToDelete.productCount > 0) {
      this.deleteError = `Cannot delete — ${this.rowToDelete.productCount} product(s) still use this collection.`;
      return;
    }

    const name = this.rowToDelete.name;
    this.collectionService.deleteCollection(this.rowToDelete.slug);
    this.closeDeleteModal();
    this.toastService.success(`Collection "${name}" deleted.`);
  }
}