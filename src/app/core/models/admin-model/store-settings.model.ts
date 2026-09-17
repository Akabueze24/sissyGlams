export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeDescription: string;
  storeAddress: string;
  announcementBar: string;

  /** Catalog base currency — fixed USD for now */
  baseCurrency: 'USD';

  storeActive: boolean;
  guestCheckout: boolean;

  shippingNotice: string;
}