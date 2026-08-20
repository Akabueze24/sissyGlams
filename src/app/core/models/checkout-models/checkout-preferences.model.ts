export interface CheckoutPreferences {
  country: string;

  shippingMethod: 'standard' | 'express' | '';

  paymentMethod:
    | 'card'
    | 'bank-transfer'
    | 'ussd'
    | 'apple-pay'
    | 'google-pay'
    | 'crypto';
}