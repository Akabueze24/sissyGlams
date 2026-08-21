import { Category } from "./category.model";

export interface ProductFilters {
  search?: string;
  category?: Category;
  subcategory?: string;
  brand?: string;
//   price?: PriceRange;
  rating?: number;
  collection?: string;
//   sort?: SortOption;
}