import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { SettingsService } from 'src/app/core/services/store-settings/store-settings.service';
import { User } from 'src/app/core/models/auth-models/user.model';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  storeName = 'Sissy Dream';

  private userSub?: Subscription;
  private settingsSub?: Subscription;

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.settingsSub = this.settingsService.settings$.subscribe((s) => {
      this.storeName = s.storeName?.trim() || 'Sissy Dream';
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.settingsSub?.unsubscribe();
  }

  /** First name only; fallback email / Admin */
  get adminFirstName(): string {
    const first = this.currentUser?.firstName?.trim();
    if (first) return first;
    if (this.currentUser?.email) return this.currentUser.email;
    return 'Admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}