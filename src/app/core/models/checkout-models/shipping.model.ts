export interface Shipping {
  method: 'standard' | 'express';
  country: string;
  state?: string;
  deliveryLocation?: string;
  minOrderValue?: number;
  maxOrderValue?: number;
}