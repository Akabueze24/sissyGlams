import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { SavedAddress } from '../../models/user-address-model/savedAddress.model';
import { ToastService } from '../toast-service/toast.service';
import { environment } from 'src/environments/environment';

/** Response from GET /api/auth/me/addresses */
export interface MyAddressesResponse {
  shipping: SavedAddress | null;
  billing: SavedAddress | null;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  /**
   * Base path for the logged-in user's addresses.
   * Example: http://localhost:5000/api/auth/me/addresses
   * Adjust environment.apiUrl if it already includes /api.
   */
  private readonly baseUrl = `${environment.apiUrl}/auth/me/addresses`;

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  // ============================================================
  // READ
  // ============================================================

  /**
   * Load shipping + billing for the current user.
   * Auth: Bearer token via interceptor (protect on the server).
   */
  getMyAddresses(): Observable<MyAddressesResponse> {
    return this.http.get<MyAddressesResponse>(this.baseUrl);
  }

  // ============================================================
  // WRITE (create or replace)
  // ============================================================

  /**
   * Create or replace the shipping address slot.
   * PUT /api/auth/me/addresses/shipping
   */
  saveShipping(address: SavedAddress): Observable<SavedAddress> {
    const body = this.normalize(address);

    return this.http
      .put<SavedAddress>(`${this.baseUrl}/shipping`, body)
      .pipe(
        tap(() => this.toastService.success('Shipping address saved.')),
      );
  }

  /**
   * Create or replace the billing address slot.
   * PUT /api/auth/me/addresses/billing
   */
  saveBilling(address: SavedAddress): Observable<SavedAddress> {
    const body = this.normalize(address);

    return this.http
      .put<SavedAddress>(`${this.baseUrl}/billing`, body)
      .pipe(
        tap(() => this.toastService.success('Billing address saved.')),
      );
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  /** Trim strings before send — keeps DB clean. */
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