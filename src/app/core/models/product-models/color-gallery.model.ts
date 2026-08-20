import { ProductColor } from "./product-color.model";

export interface ColorGallery {
  color: ProductColor;
  images: string[];
}