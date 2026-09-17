import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StoreSettings } from '../../models/admin-model/store-settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly STORAGE_KEY = 'sissy-dream-store-settings';

  private settingsSource = new BehaviorSubject<StoreSettings>(
    this.loadSettings()
  );

  /** Live stream for header / other UI */
  settings$ = this.settingsSource.asObservable();

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

  // ============================================================
  // WRITE
  // ============================================================

  /**
   * Merge partial updates, persist, notify subscribers.
   */
  updateSettings(partial: Partial<StoreSettings>): StoreSettings {
    const next: StoreSettings = {
      ...this.settingsSource.value,
      ...partial,
      // Always keep catalog base as USD for this stage of the app
      baseCurrency: 'USD',
    };

    this.setSettings(next);
    return next;
  }

  /**
   * Replace all settings (e.g. full form save).
   */
  saveSettings(settings: StoreSettings): StoreSettings {
    const next: StoreSettings = {
      ...settings,
      storeName: settings.storeName?.trim() || this.getDefaults().storeName,
      storeEmail: settings.storeEmail?.trim() || '',
      storePhone: settings.storePhone?.trim() || '',
      storeDescription: settings.storeDescription?.trim() || '',
      storeAddress: settings.storeAddress?.trim() || '',
      announcementBar: settings.announcementBar?.trim() || '',
      shippingNotice: settings.shippingNotice?.trim() || '',
      baseCurrency: 'USD',
      storeActive: !!settings.storeActive,
      guestCheckout: !!settings.guestCheckout,
    };

    this.setSettings(next);
    return next;
  }

  resetToDefaults(): StoreSettings {
    const defaults = this.getDefaults();
    this.setSettings(defaults);
    return defaults;
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private setSettings(settings: StoreSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    this.settingsSource.next(settings);
  }

  private loadSettings(): StoreSettings {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<StoreSettings>;
        return {
          ...this.getDefaults(),
          ...parsed,
          baseCurrency: 'USD',
        };
      } catch {
        // fall through
      }
    }

    return this.getDefaults();
  }

  private getDefaults(): StoreSettings {
    return {
      storeName: 'Sissy Glams',
      storeEmail: 'hello@sissyglams.com',
      storePhone: '',
      storeDescription: '',
      storeAddress: '',
      announcementBar: ' 🎀 Worldwide Shipping Shipping rates calculated based on your location Shop Now 🎀',
      baseCurrency: 'USD',
      storeActive: true,
      guestCheckout: true,
      shippingNotice: '',
    };
  }
}