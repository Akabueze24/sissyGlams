import { Category } from './category.model';
import { Subcategory } from './subcategory.model';

import { ProductSize } from './size.model';

import { Collection } from './collection.model';
import { ProductDetails } from './product-detals.model';
import { ProductColor } from './product-color.model';
import { ProductLength } from './product-length.model';
import { ColorGallery } from './color-gallery.model';


export interface Product {
  // Basic information
  id: string;
  name: string;
  slug: string;
  brand: string;

  // Classification
  category: Category;
  subcategory?: string;

  // Images
  images: string[];

  // Pricing
  price: number;
  oldPrice?: number;

  // Product information
  productDetails: ProductDetails;

  // Product options
  colors?: ProductColor[];
  colorGalleries?: ColorGallery[];
  sizes?: ProductSize[];
  lengths?: ProductLength[];

  // Reviews
  rating: number;
  reviewCount: number;

  // Collections
  collections?: Collection[];

  // Store status
  active: boolean;
}