import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { SavedAddress } from '../../models/user-address-model/savedAddress.model';
import { ToastService } from '../toast-service/toast.service';
import { environment } from 'src/environments/environment';

/** Matches GET /api/auth/me/addresses */
export interface MyAddressesResponse {
  shipping: SavedAddress | null;
  billing: SavedAddress | null;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly baseUrl = `${environment.apiUrl}/auth/me/addresses`;

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  /** Load both slots for the logged-in user (token via interceptor). */
  getMyAddresses(): Observable<MyAddressesResponse> {
    return this.http.get<MyAddressesResponse>(this.baseUrl);
  }

  /** Create or replace shipping address. */
  saveShipping(address: SavedAddress): Observable<SavedAddress> {
    return this.http
      .put<SavedAddress>(`${this.baseUrl}/shipping`, address)
      .pipe(
        tap(() => this.toastService.success('Shipping address saved.')),
      );
  }

  /** Create or replace billing address. */
  saveBilling(address: SavedAddress): Observable<SavedAddress> {
    return this.http
      .put<SavedAddress>(`${this.baseUrl}/billing`, address)
      .pipe(
        tap(() => this.toastService.success('Billing address saved.')),
      );
  }
}