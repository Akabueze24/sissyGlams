import { Injectable } from '@angular/core';
import { SavedAddress } from '../../models/user-adress-model/SavedAddress,model';
import { ToastService } from '../toast-service/toast.service';

interface UserAddresses {
  shipping?: SavedAddress;
  billing?: SavedAddress;
}

/** userId → addresses */
type AddressBook = Record<string, UserAddresses>;

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly STORAGE_KEY = 'sissy-dream-addresses';

  constructor(private toastService: ToastService) {}

  getShipping(userId: string): SavedAddress | null {
    return this.getUserAddresses(userId).shipping ?? null;
  }

  getBilling(userId: string): SavedAddress | null {
    return this.getUserAddresses(userId).billing ?? null;
  }

  saveShipping(userId: string, address: SavedAddress): void {
    const book = this.loadBook();
    const current = book[userId] ?? {};

    book[userId] = {
      ...current,
      shipping: this.normalize(address),
    };

    this.saveBook(book);
    this.toastService.success('Shipping address saved.');
  }

  saveBilling(userId: string, address: SavedAddress): void {
    const book = this.loadBook();
    const current = book[userId] ?? {};

    book[userId] = {
      ...current,
      billing: this.normalize(address),
    };

    this.saveBook(book);
    this.toastService.success('Billing address saved.');
  }

  clearShipping(userId: string): void {
    const book = this.loadBook();
    if (!book[userId]?.shipping) return;

    const { shipping, ...rest } = book[userId];
    book[userId] = rest;
    this.saveBook(book);
    this.toastService.success('Shipping address removed.');
  }

  clearBilling(userId: string): void {
    const book = this.loadBook();
    if (!book[userId]?.billing) return;

    const { billing, ...rest } = book[userId];
    book[userId] = rest;
    this.saveBook(book);
    this.toastService.success('Billing address removed.');
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private getUserAddresses(userId: string): UserAddresses {
    return this.loadBook()[userId] ?? {};
  }

  private loadBook(): AddressBook {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return {};

    try {
      return JSON.parse(raw) as AddressBook;
    } catch {
      return {};
    }
  }

  private saveBook(book: AddressBook): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(book));
  }

  private normalize(address: SavedAddress): SavedAddress {
    return {
      firstName: address.firstName.trim(),
      lastName: address.lastName.trim(),
      phone: address.phone.trim(),
      address: address.address.trim(),
      apartment: address.apartment?.trim() || undefined,
      city: address.city.trim(),
      state: address.state.trim(),
      postalCode: address.postalCode.trim(),
      country: address.country.trim(),
    };
  }
}