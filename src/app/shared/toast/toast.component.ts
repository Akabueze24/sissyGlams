import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Toast } from 'src/app/core/models/toast-model/toast.model';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
 
})
export class ToastComponent implements OnInit, OnDestroy {

  // ============================================================
  // TOASTS
  // ============================================================

  toasts: Toast[] = [];

  // ============================================================
  // SUBSCRIPTION
  // ============================================================

  private toastSubscription!: Subscription;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(private toastService: ToastService) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toast$.subscribe(
      (toast) => {
        this.addToast(toast);
      }
    );
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }

  // ============================================================
  // ADD TOAST
  // ============================================================

  private addToast(toast: Toast): void {
    this.toasts.push(toast);

    // Automatically remove the toast
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.duration);
  }

  // ============================================================
  // REMOVE TOAST
  // ============================================================

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(
      (toast) => toast.id !== id
    );
  }

  // ============================================================
  // GET ICON
  // ============================================================

  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check';

      case 'error':
        return 'fa-solid fa-circle-xmark';

      case 'warning':
        return 'fa-solid fa-triangle-exclamation';

      case 'info':
        return 'fa-solid fa-circle-info';

      default:
        return 'fa-solid fa-circle-info';
    }
  }
}