import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { StoreSettings } from '../../models/admin-model/store-settings.model';
import { environment } from 'src/environments/environment';

interface SettingsResponse {
  settings: StoreSettings;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiUrl = `${environment.apiUrl}/settings`;
  

  private settingsSource = new BehaviorSubject<StoreSettings>(this.getDefaults());

  /** Live stream for header / other UI */
  settings$ = this.settingsSource.asObservable();

  constructor(private http: HttpClient) {
    // Load once when the app first uses this service
    this.loadFromApi().subscribe({
      error: () => {
        // Keep defaults if API is down; header still works offline-ish
      },
    });
  }

  // ============================================================
  // READ
  // ============================================================

  getSettings(): StoreSettings {
    return this.settingsSource.value;
  }

  /** Snapshot copy safe to bind on a form */
  getSettingsCopy(): StoreSettings {
    return { ...this.settingsSource.value };
  }

  /**
   * Fetch singleton from API and push into settings$.
   */
  loadFromApi(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(this.apiUrl).pipe(
      tap((res) => {
        const next = this.normalize(res.settings);
        this.settingsSource.next(next);
      })
    );
  }

  // ============================================================
  // WRITE
  // ============================================================

  /**
   * Full form save → PUT → update stream.
   * Returns Observable so the component can show loading / toast.
   */
  saveSettings(settings: StoreSettings): Observable<SettingsResponse> {
    const body = this.normalize(settings);

    return this.http.put<SettingsResponse>(this.apiUrl, body).pipe(
      tap((res) => {
        this.settingsSource.next(this.normalize(res.settings));
      })
    );
  }

  /**
   * Partial update (optional helper).
   */
  updateSettings(partial: Partial<StoreSettings>): Observable<SettingsResponse> {
    const merged = this.normalize({
      ...this.settingsSource.value,
      ...partial,
    });
    return this.saveSettings(merged);
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private normalize(settings: Partial<StoreSettings>): StoreSettings {
    const defaults = this.getDefaults();

    return {
      storeName: settings.storeName?.trim() || defaults.storeName,
      storeEmail: settings.storeEmail?.trim() || '',
      storePhone: settings.storePhone?.trim() || '',
      storeDescription: settings.storeDescription?.trim() || '',
      storeAddress: settings.storeAddress?.trim() || '',
      announcementBar: settings.announcementBar?.trim() || '',
      shippingNotice: settings.shippingNotice?.trim() || '',
      baseCurrency: 'USD',
      storeActive: settings.storeActive ?? true,
      guestCheckout: settings.guestCheckout ?? true,
    };
  }

  private getDefaults(): StoreSettings {
    return {
      storeName: 'Sissy Glams',
      storeEmail: 'hello@sissyglams.com',
      storePhone: '',
      storeDescription: '',
      storeAddress: '',
      announcementBar:
        ' 🎀 Worldwide Shipping Shipping rates calculated based on your location Shop Now 🎀',
      baseCurrency: 'USD',
      storeActive: true,
      guestCheckout: true,
      shippingNotice: '',
    };
  }
}