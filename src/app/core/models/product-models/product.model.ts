import { Category } from './category.model';
import { ProductSize } from './size.model';
import { Collection } from './collection.model';
import { ProductColor } from './product-color.model';
import { ProductLength } from './product-length.model';
import { ColorGallery } from './color-gallery.model';
import { ProductDetails } from './product-detals.model';

export interface Product {
  // ========================================
  // BASIC INFORMATION
  // ========================================

  id: string;
  name: string;
  slug: string;
  brand: string;

  // ========================================
  // CLASSIFICATION
  // ========================================

  category: Category;

  /**
   * Stores the slug of the subcategory.
   *
   * Examples:
   * 'casual-dresses'
   * 'fantasy-dresses'
   * 'lingerie-sets'
   * 'corsets'
   * 'pants'
   */
  subcategory?: string;

  // ========================================
  // IMAGES
  // ========================================

  images: string[];

  // ========================================
  // PRICING
  // ========================================

  price: number;
  oldPrice?: number;

  // ========================================
  // PRODUCT INFORMATION
  // ========================================

  productDetails: ProductDetails;

  // ========================================
  // PRODUCT OPTIONS
  // ========================================

  colors?: ProductColor[];

  /**
   * Different image galleries for each color.
   */
  colorGalleries?: ColorGallery[];

  sizes?: ProductSize[];

  lengths?: ProductLength[];

  // ========================================
  // REVIEWS
  // ========================================

  rating: number;
  reviewCount: number;

  // ========================================
  // COLLECTIONS
  // ========================================

  collections?: Collection[];

  // ========================================
  // STORE STATUS
  // ========================================

  active: boolean;
}