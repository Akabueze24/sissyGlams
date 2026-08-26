import { Category } from './category.model';

export interface ProductFilters {
  search?: string;
  category?: Category;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  collection?: string;
  sort?:
    | 'default'
    | 'newest'
    | 'price-asc'
    | 'price-desc'
    | 'name-asc'
    | 'name-desc'
    | 'rating-desc';
    page?: number;      // Added
    pageSize?: number;  // Added
}
