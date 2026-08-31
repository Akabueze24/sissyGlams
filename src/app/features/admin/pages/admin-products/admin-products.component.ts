import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/core/models/product-models/product.model';
import { Category } from 'src/app/core/models/product-models/category.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { StoreCollection } from 'src/app/core/models/product-models/store-collection.model';
import { Subcategory } from 'src/app/core/models/product-models/subcategory.model';

interface ColorRow {
  name: string;
  value: string;
  image: string;
  galleryText: string;
}

interface OptionRow {
  name: string;
  value: string;
}

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];

  searchTerm = '';
  categoryFilter: Category | '' = '';
  subcategoryFilter = '';
  collectionFilter = '';
  statusFilter: '' | 'active' | 'inactive' = '';

  categories: Category[] = [];
  storeCollections: StoreCollection[] = [];

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  showAddForm = false;

  addForm = {
    name: '',
    brand: '',
    category: '' as Category | '',
    subcategory: '',
    collectionSlugs: [] as string[],
    price: 0,
    imageUrl: '',
    description: '',
    active: true,
  };

  addErrors: {
    name?: string;
    brand?: string;
    category?: string;
    price?: string;
    imageUrl?: string;
    description?: string;
  } = {};

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  showEditForm = false;
  editingProductId: string | null = null;

  editForm = {
    name: '',
    brand: '',
    category: '' as Category | '',
    subcategory: '',
    collectionSlugs: [] as string[],
    price: 0,
    oldPrice: null as number | null,
    imageUrlsText: '',
    description: '',
    detailsText: '',
    shipping: '',
    returns: '',
    active: true,
    colorRows: [] as ColorRow[],
    sizeRows: [] as OptionRow[],
    lengthRows: [] as OptionRow[],
  };

  editErrors: {
    name?: string;
    brand?: string;
    category?: string;
    price?: string;
    images?: string;
  } = {};

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  showDeleteModal = false;
  productToDelete: Product | null = null;

  private productsSubscription!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories = this.productService
      .getCategoryNav()
      .map((item) => item.category);

    this.storeCollections = this.productService.getStoreCollections();

    this.productsSubscription = this.productService.adminProducts$.subscribe(
      (products) => {
        this.products = products;
      },
    );
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  // ============================================================
  // SUBCATEGORY HELPERS (forms + toolbar filter)
  // ============================================================

  get subcategoriesForAdd(): Subcategory[] {
    if (!this.addForm.category) {
      return [];
    }

    return (
      this.productService
        .getCategoryNav()
        .find((item) => item.category === this.addForm.category)
        ?.subcategories ?? []
    );
  }

  get subcategoriesForEdit(): Subcategory[] {
    if (!this.editForm.category) {
      return [];
    }

    return (
      this.productService
        .getCategoryNav()
        .find((item) => item.category === this.editForm.category)
        ?.subcategories ?? []
    );
  }

  get subcategoriesForFilter(): Subcategory[] {
    if (!this.categoryFilter) {
      return [];
    }

    return (
      this.productService
        .getCategoryNav()
        .find((item) => item.category === this.categoryFilter)?.subcategories ??
      []
    );
  }

  onAddCategoryChange(): void {
    this.addForm.subcategory = '';
  }

  onEditCategoryChange(): void {
    this.editForm.subcategory = '';
  }

  onCategoryFilterChange(): void {
    this.subcategoryFilter = '';
  }

  // ============================================================
  // COLLECTION HELPERS
  // ============================================================

  toggleCollectionSlug(
    list: string[],
    slug: string,
    checked: boolean,
  ): string[] {
    if (checked) {
      return list.includes(slug) ? list : [...list, slug];
    }

    return list.filter((item) => item !== slug);
  }

  private collectionsFromSlugs(slugs: string[]) {
    return this.storeCollections.filter((collection) =>
      slugs.includes(collection.slug),
    );
  }

  // ============================================================
  // FILTERED LIST
  // ============================================================

  get filteredProducts(): Product[] {
    let result = [...this.products];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((product) => {
        const name = product.name.toLowerCase();
        const id = product.id.toLowerCase();
        const brand = product.brand.toLowerCase();
        return name.includes(term) || id.includes(term) || brand.includes(term);
      });
    }

    if (this.categoryFilter) {
      result = result.filter(
        (product) => product.category === this.categoryFilter,
      );
    }

    if (this.subcategoryFilter) {
      result = result.filter(
        (product) => product.subcategory === this.subcategoryFilter,
      );
    }

    if (this.collectionFilter) {
      result = result.filter((product) =>
        product.collections?.some(
          (collection) => collection.slug === this.collectionFilter,
        ),
      );
    }

    if (this.statusFilter === 'active') {
      result = result.filter((product) => product.active);
    }

    if (this.statusFilter === 'inactive') {
      result = result.filter((product) => !product.active);
    }

    return result;
  }

  // ============================================================
  // ACTIVE TOGGLE
  // ============================================================

  toggleActive(product: Product): void {
    this.productService.toggleProductActive(product.id);
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  private validateAddForm(): boolean {
    const errors: typeof this.addErrors = {};

    if (!this.addForm.name.trim()) {
      errors.name = 'Product name is required.';
    }

    if (!this.addForm.brand.trim()) {
      errors.brand = 'Brand is required.';
    }

    if (!this.addForm.category) {
      errors.category = 'Category is required.';
    }

    if (this.addForm.price == null || this.addForm.price <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    if (!this.addForm.imageUrl.trim()) {
      errors.imageUrl = 'Product image URL is required.';
    }

    if (!this.addForm.description.trim()) {
      errors.description = 'Description is required.';
    }

    this.addErrors = errors;
    return Object.keys(errors).length === 0;
  }

  private validateEditForm(): boolean {
    const errors: typeof this.editErrors = {};

    if (!this.editForm.name.trim()) {
      errors.name = 'Product name is required.';
    }

    if (!this.editForm.brand.trim()) {
      errors.brand = 'Brand is required.';
    }

    if (!this.editForm.category) {
      errors.category = 'Category is required.';
    }

    if (this.editForm.price == null || this.editForm.price <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    const images = this.editForm.imageUrlsText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => !!url);

    if (!images.length) {
      errors.images = 'Add at least one gallery image URL.';
    }

    this.editErrors = errors;
    return Object.keys(errors).length === 0;
  }

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  openAddForm(): void {
    this.showEditForm = false;
    this.editingProductId = null;
    document.body.style.overflow = '';
    this.addErrors = {};
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.resetAddForm();
  }

  submitAddForm(): void {
    if (!this.validateAddForm()) {
      return;
    }

    const collections = this.collectionsFromSlugs(this.addForm.collectionSlugs);

    this.productService.addProduct({
      name: this.addForm.name,
      brand: this.addForm.brand,
      category: this.addForm.category as Category,
      subcategory: this.addForm.subcategory || undefined,
      collections: collections.length ? collections : undefined,
      price: Number(this.addForm.price),
      imageUrl: this.addForm.imageUrl,
      description: this.addForm.description,
      active: this.addForm.active,
    });

    this.closeAddForm();
  }

  private resetAddForm(): void {
    this.addForm = {
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      collectionSlugs: [],
      price: 0,
      imageUrl: '',
      description: '',
      active: true,
    };
    this.addErrors = {};
  }

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  openEditForm(product: Product): void {
    this.showAddForm = false;
    this.editingProductId = product.id;
    this.editErrors = {};

    const colorRows: ColorRow[] = (product.colors ?? []).map((color) => {
      const gallery = product.colorGalleries?.find(
        (g) => g.color.value === color.value,
      );

      return {
        name: color.name,
        value: color.value,
        image: color.image,
        galleryText: (gallery?.images ?? []).join('\n'),
      };
    });

    this.editForm = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory ?? '',
      collectionSlugs: (product.collections ?? []).map((c) => c.slug),
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      imageUrlsText: (product.images ?? []).join('\n'),
      description: product.productDetails?.description ?? '',
      detailsText: (product.productDetails?.details ?? []).join('\n'),
      shipping: product.productDetails?.shipping ?? '',
      returns: product.productDetails?.returns ?? '',
      active: product.active,
      colorRows,
      sizeRows: (product.sizes ?? []).map((s) => ({
        name: s.name,
        value: s.value,
      })),
      lengthRows: (product.lengths ?? []).map((l) => ({
        name: l.name,
        value: l.value,
      })),
    };

    this.showEditForm = true;
    document.body.style.overflow = 'hidden';
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.editingProductId = null;
    this.editErrors = {};
    document.body.style.overflow = '';
  }

  submitEditForm(): void {
    if (!this.editingProductId) {
      return;
    }

    if (!this.validateEditForm()) {
      return;
    }

    const images = this.editForm.imageUrlsText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => !!url);

    const details = this.editForm.detailsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !!line);

    const colors = this.editForm.colorRows
      .filter((row) => row.name.trim() && row.value.trim())
      .map((row) => ({
        name: row.name.trim(),
        value: row.value.trim(),
        image: row.image.trim() || images[0],
      }));

    const colorGalleries = this.editForm.colorRows
      .filter((row) => row.name.trim() && row.value.trim())
      .map((row) => {
        const galleryImages = row.galleryText
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => !!url);

        return {
          color: {
            name: row.name.trim(),
            value: row.value.trim(),
            image: row.image.trim() || images[0],
          },
          images: galleryImages.length ? galleryImages : images,
        };
      });

    const sizes = this.editForm.sizeRows
      .filter((row) => row.name.trim() && row.value.trim())
      .map((row) => ({
        name: row.name.trim(),
        value: row.value.trim(),
      }));

    const lengths = this.editForm.lengthRows
      .filter((row) => row.name.trim() && row.value.trim())
      .map((row) => ({
        name: row.name.trim(),
        value: row.value.trim(),
      }));

    const collections = this.collectionsFromSlugs(
      this.editForm.collectionSlugs,
    );

    this.productService.updateProduct(this.editingProductId, {
      name: this.editForm.name,
      brand: this.editForm.brand,
      category: this.editForm.category as Category,
      subcategory: this.editForm.subcategory || undefined,
      collections,
      price: Number(this.editForm.price),
      oldPrice:
        this.editForm.oldPrice != null && this.editForm.oldPrice > 0
          ? Number(this.editForm.oldPrice)
          : undefined,
      images,
      active: this.editForm.active,
      productDetails: {
        description: this.editForm.description.trim(),
        details,
        shipping: this.editForm.shipping.trim(),
        returns: this.editForm.returns.trim(),
      },
      colors,
      colorGalleries,
      sizes,
      lengths,
    });

    this.closeEditForm();
  }

  // ============================================================
  // VARIANT ROW HELPERS
  // ============================================================

  addColorRow(): void {
    this.editForm.colorRows.push({
      name: '',
      value: '',
      image: '',
      galleryText: '',
    });
  }

  removeColorRow(index: number): void {
    this.editForm.colorRows.splice(index, 1);
  }

  addSizeRow(): void {
    this.editForm.sizeRows.push({ name: '', value: '' });
  }

  removeSizeRow(index: number): void {
    this.editForm.sizeRows.splice(index, 1);
  }

  addLengthRow(): void {
    this.editForm.lengthRows.push({ name: '', value: '' });
  }

  removeLengthRow(index: number): void {
    this.editForm.lengthRows.splice(index, 1);
  }

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
    document.body.style.overflow = '';
  }

  confirmDelete(): void {
    if (!this.productToDelete) {
      return;
    }

    this.productService.deleteProduct(this.productToDelete.id);
    this.closeDeleteModal();
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  get totalCount(): number {
    return this.products.length;
  }

  get activeCount(): number {
    return this.products.filter((p) => p.active).length;
  }

  get inactiveCount(): number {
    return this.products.filter((p) => !p.active).length;
  }

  categoryLabel(category: string): string {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  subcategoryLabel(slug: string | undefined): string {
    if (!slug) {
      return '';
    }

    const sub = this.productService
      .getCategoryNav()
      .flatMap((item) => item.subcategories)
      .find((s) => s.slug === slug);

    return sub?.name ?? this.categoryLabel(slug);
  }

  /** Split gallery textarea into clean URLs */
  get editGalleryPreviewUrls(): string[] {
    return this.editForm.imageUrlsText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => !!url);
  }

  previewUrlsFromText(text: string): string[] {
    return text
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => !!url);
  }

  isImageUrl(url: string): boolean {
    const value = url.trim();
    if (!value) return false;
    return (
      /^https?:\/\//i.test(value) ||
      /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(value)
    );
  }

  onPreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/80x80?text=Invalid';
  }
}
