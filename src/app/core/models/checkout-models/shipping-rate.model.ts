export interface ShippingRate {
  _id?: string;
  id?: string;
  countryCode: string;
  countryName: string;
  standard: number;
  express: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}