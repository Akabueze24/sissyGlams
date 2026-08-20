import { Product } from '../product-models/product.model';
import { ProductColor } from '../product-models/product-color.model';
import { ProductLength } from '../product-models/product-length.model';
import { ProductSize } from '../product-models/size.model';

export interface CartItem {
  product: Product;
  quantity: number;

  color?: ProductColor;
  size?: ProductSize;
  length?: ProductLength;
}
