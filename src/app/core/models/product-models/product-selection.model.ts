import { ProductColor } from "./product-color.model";
import { ProductLength } from "./product-length.model";
import { ProductSize } from "./size.model";


export interface ProductSelection {
  color?: ProductColor;
  size?: ProductSize;
  length?: ProductLength;
  quantity: number;
}