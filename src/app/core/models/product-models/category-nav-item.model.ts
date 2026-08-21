import { Category } from './category.model';
import { Subcategory } from './subcategory.model';

export interface CategoryNavItem {
  category: Category;
  label: string;
  subcategories: Subcategory[];
}