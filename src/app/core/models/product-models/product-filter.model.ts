import { Category } from "./category.model";

export interface ProductFilters {
  search?: string;
  category?: Category;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  collection?: string;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'popular';
}