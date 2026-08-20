export interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryLocation: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'bank-transfer' | 'ussd' | 'apple-pay' | 'google-pay' | 'crypto';
}