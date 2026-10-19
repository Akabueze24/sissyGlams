import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreSettings } from 'src/app/core/models/admin-model/store-settings.model';
import { SettingsService } from 'src/app/core/services/store-settings/store-settings.service';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  /** Working copy for the form (saved only on Save) */
  form!: StoreSettings;

  saving = false;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Prefer fresh data from API (service may still be on defaults for a moment)
    this.settingsService.loadFromApi().subscribe({
      next: () => {
        this.form = this.settingsService.getSettingsCopy();
      },
      error: () => {
        // Fallback: whatever is already in the stream (defaults)
        this.form = this.settingsService.getSettingsCopy();
        this.toastService.error('Could not load settings from server.');
      },
    });
  }

  /**
   * Persist the whole form via SettingsService (PUT).
   */
  saveSettings(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;

    this.settingsService.saveSettings(this.form).subscribe({
      next: () => {
        this.form = this.settingsService.getSettingsCopy();
        this.saving = false;
        this.toastService.success('Settings saved.');
      },
      error: () => {
        this.saving = false;
        this.toastService.error('Could not save settings. Are you logged in as admin?');
      },
    });
  }

  /**
   * Log out and leave admin.
   */
  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}