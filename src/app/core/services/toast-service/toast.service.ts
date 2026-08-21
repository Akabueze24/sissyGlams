import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../../models/toast-model/toast.model';
import { ToastType } from '../../models/toast-model/toast-type.model';





@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();

  toast$ = this.toastSubject.asObservable();

  private toastId = 0;

  // ============================================================
  // SUCCESS
  // ============================================================

  success(message: string, duration: number = 5000): void {
    this.show(message, 'success', duration);
  }

  // ============================================================
  // ERROR
  // ============================================================

  error(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  // ============================================================
  // WARNING
  // ============================================================

  warning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  // ============================================================
  // INFO
  // ============================================================

  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  // ============================================================
  // SHOW TOAST
  // ============================================================

  private show(
    message: string,
    type: ToastType,
    duration: number
  ): void {
    this.toastId++;

    const toast: Toast = {
      id: this.toastId,
      message,
      type,
      duration,
    };

    this.toastSubject.next(toast);
  }
}