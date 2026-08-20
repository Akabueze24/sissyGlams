import { Category } from "./category.model";


export interface Subcategory {
  name: string;
  slug: string;
  category: Category;
}