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

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.settingsService.getSettingsCopy();
  }

  /**
   * Persist the whole form via SettingsService.
   */
  saveSettings(): void {
    this.form = this.settingsService.saveSettings(this.form);
    this.toastService.success('Settings saved.');
  }

  /**
   * Log out and leave admin.
   */
  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}