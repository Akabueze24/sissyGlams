export interface CreateShippingRateInput {
  countryCode: string;
  countryName: string;
  standard: number;
  express: number;
  active?: boolean;
}