import { ProductColor } from '../product-models/product-color.model';
import { ProductLength } from '../product-models/product-length.model';
import { ProductSize } from '../product-models/size.model';
export interface Order {
  id: string;

  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };

  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    deliveryLocation: string;
  };

  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    color?: ProductColor;
    size?: ProductSize;
    length?: ProductLength;
  }[];

  subtotal: number;
  shippingCost: number;
  total: number;

  shippingMethod: 'standard' | 'express';

  paymentMethod:
    | 'card'
    | 'bank-transfer'
    | 'ussd'
    | 'apple-pay'
    | 'google-pay'
    | 'crypto';

  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  createdAt: string;
}
