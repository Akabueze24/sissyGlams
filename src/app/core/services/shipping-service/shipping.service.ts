import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ToastService } from '../toast-service/toast.service';

import { ShippingRate } from '../../models/checkout-models/shipping-rate.model';
import { CreateShippingRateInput } from '../../models/checkout-models/CreateShippingRateInput.model';
import { ShippingQuote } from '../../models/checkout-models/shippingQuote.model';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private baseUrl = `${environment.apiUrl}/shipping`;

  private ratesSource = new BehaviorSubject<ShippingRate[]>([]);
  rates$ = this.ratesSource.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  // ============================================================
  // READ
  // ============================================================

loadRatesForAdmin(): Observable<ShippingRate[]> {
  const params = new HttpParams().set('all', 'true');

  return this.http.get<unknown>(`${this.baseUrl}/rates`, { params }).pipe(
    map((res) => this.asRateArray(res).map((r) => this.normalize(r))),
    tap((list) => this.ratesSource.next(list)),
    catchError((err) => {
      console.error('Failed to load shipping rates (admin)', err);
      this.toastService.error('Could not load shipping rates.');
      this.ratesSource.next([]);
      return of([]);
    }),
  );
}

getRates(): Observable<ShippingRate[]> {
  return this.http.get<unknown>(`${this.baseUrl}/rates`).pipe(
    map((res) => this.asRateArray(res).map((r) => this.normalize(r))),
    catchError((err) => {
      console.error('Failed to load shipping rates', err);
      return of([]);
    }),
  );
}

private asRateArray(res: unknown): ShippingRate[] {
  if (Array.isArray(res)) {
    return res as ShippingRate[];
  }
  if (res && typeof res === 'object') {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj['data'])) {
      return obj['data'] as ShippingRate[];
    }
    if (Array.isArray(obj['rates'])) {
      return obj['rates'] as ShippingRate[];
    }
  }
  return [];
}
  getQuote(countryCode: string): Observable<ShippingQuote | null> {
  const code = countryCode.trim().toUpperCase();
  if (!code) {
    return of(null);
  }

  return this.http
    .get<ShippingQuote>(
      `${this.baseUrl}/quote/${encodeURIComponent(code)}`,
    )
    .pipe(
      catchError((err) => {
        console.error('Failed to load shipping quote', err);
        return of(null);
      }),
    );
}

  // ============================================================
  // WRITE (admin)
  // ============================================================

  createRate(input: CreateShippingRateInput): Observable<ShippingRate | null> {
    const body: CreateShippingRateInput = {
      countryCode: input.countryCode.trim().toUpperCase(),
      countryName: input.countryName.trim(),
      standard: Number(input.standard) || 0,
      express: Number(input.express) || 0,
      active: input.active !== false,
    };

    return this.http.post<ShippingRate>(`${this.baseUrl}/rates`, body).pipe(
      map((r) => this.normalize(r)),
      tap((created) => {
        if (created) {
          this.ratesSource.next([created, ...this.ratesSource.value]);
          this.toastService.success('Shipping destination added.');
        }
      }),
      catchError((err) => {
        console.error('Failed to create shipping rate', err);
        this.toastService.error(
          err?.error?.message || 'Could not add shipping destination.',
        );
        return of(null);
      }),
    );
  }

  updateRate(
    id: string,
    changes: Partial<CreateShippingRateInput>,
  ): Observable<ShippingRate | null> {
    const body: Partial<CreateShippingRateInput> = {};

    if (changes.countryCode != null) {
      body.countryCode = changes.countryCode.trim().toUpperCase();
    }
    if (changes.countryName != null) {
      body.countryName = changes.countryName.trim();
    }
    if (changes.standard != null) {
      body.standard = Number(changes.standard);
    }
    if (changes.express != null) {
      body.express = Number(changes.express);
    }
    if (changes.active != null) {
      body.active = changes.active;
    }

    return this.http
      .put<ShippingRate>(`${this.baseUrl}/rates/${id}`, body)
      .pipe(
        map((r) => this.normalize(r)),
        tap((updated) => {
          if (updated) {
            this.ratesSource.next(
              this.ratesSource.value.map((row) =>
                this.rateId(row) === id ? updated : row,
              ),
            );
            this.toastService.success('Shipping rate updated.');
          }
        }),
        catchError((err) => {
          console.error('Failed to update shipping rate', err);
          this.toastService.error(
            err?.error?.message || 'Could not update shipping rate.',
          );
          return of(null);
        }),
      );
  }

  deleteRate(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/rates/${id}`).pipe(
      map(() => true),
      tap(() => {
        this.ratesSource.next(
          this.ratesSource.value.filter((row) => this.rateId(row) !== id),
        );
        this.toastService.success('Shipping destination removed.');
      }),
      catchError((err) => {
        console.error('Failed to delete shipping rate', err);
        this.toastService.error(
          err?.error?.message || 'Could not delete shipping destination.',
        );
        return of(false);
      }),
    );
  }

  // ============================================================
  // HELPERS
  // ============================================================

  rateId(rate: ShippingRate): string {
    return rate._id || rate.id || '';
  }

  private normalize(rate: ShippingRate): ShippingRate {
    return {
      ...rate,
      id: rate._id || rate.id,
      countryCode: (rate.countryCode || '').toUpperCase(),
      active: rate.active !== false,
    };
  }
}
