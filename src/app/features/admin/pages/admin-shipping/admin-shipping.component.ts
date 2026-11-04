import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShippingRate } from 'src/app/core/models/checkout-models/shipping-rate.model';
import { CreateShippingRateInput } from 'src/app/core/models/checkout-models/CreateShippingRateInput.model';
import { ShippingService } from 'src/app/core/services/shipping-service/shipping.service';

@Component({
  selector: 'app-admin-shipping',
  templateUrl: './admin-shipping.component.html',
  styleUrls: ['./admin-shipping.component.scss'],
})
export class AdminShippingComponent implements OnInit, OnDestroy {
  // List
  rates: ShippingRate[] = [];
  filteredRates: ShippingRate[] = [];

  searchTerm = '';
  statusFilter: '' | 'active' | 'inactive' = '';

  // Summary (updated when rates change)
  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  activeOptionsCount = 0;

  // Form modal
  showFormModal = false;
  isEditMode = false;
  editingId: string | null = null;
  form: CreateShippingRateInput = this.emptyForm();
  formError = '';

  // View / delete
  showViewModal = false;
  viewRate: ShippingRate | null = null;

  showDeleteModal = false;
  rateToDelete: ShippingRate | null = null;

  private ratesSub?: Subscription;

  constructor(private shippingService: ShippingService) {}

  ngOnInit(): void {
    this.ratesSub = this.shippingService.rates$.subscribe((list) => {
  this.rates = list ?? [];
  console.log('rates', this.rates);
  this.refreshSummary();
  this.applyFilters();
  console.log('filteredRates', this.filteredRates);
});

    this.shippingService.loadRatesForAdmin().subscribe();
  }

  ngOnDestroy(): void {
    this.ratesSub?.unsubscribe();
    document.body.style.overflow = '';
  }

  // ============================================================
  // FILTERS
  // ============================================================

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  private applyFilters(): void {
  let list = [...(this.rates || [])];

  const term = (this.searchTerm || '').trim().toLowerCase();

  if (term) {
    list = list.filter((rate) => {
      const name = String(rate.countryName ?? '').toLowerCase();
      const code = String(rate.countryCode ?? '').toLowerCase();
      return name.includes(term) || code.includes(term);
    });
  }

  if (this.statusFilter === 'active') {
    list = list.filter((rate) => rate.active !== false);
  }

  if (this.statusFilter === 'inactive') {
    list = list.filter((rate) => rate.active === false);
  }

  this.filteredRates = list;
}

  private refreshSummary(): void {
    this.totalCount = this.rates.length;
    this.activeCount = this.rates.filter((r) => r.active !== false).length;
    this.inactiveCount = this.rates.filter((r) => r.active === false).length;
    this.activeOptionsCount = this.activeCount * 2;
  }

trackByRate(index: number, rate: ShippingRate): string {
  const id = this.shippingService.rateId(rate);
  // Always unique: prefer Mongo id, otherwise index fallback
  return id || `rate-${index}`;
}

  // ============================================================
  // ADD / EDIT
  // ============================================================

  openAddForm(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
    this.formError = '';
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditForm(rate: ShippingRate): void {
    this.isEditMode = true;
    this.editingId = this.shippingService.rateId(rate);
    this.form = {
      countryCode: rate.countryCode || '',
      countryName: rate.countryName || '',
      standard: Number(rate.standard) || 0,
      express: Number(rate.express) || 0,
      active: rate.active !== false,
    };
    this.formError = '';
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
    this.formError = '';
    document.body.style.overflow = '';
  }

  submitForm(): void {
    this.formError = '';

    const code = (this.form.countryCode || '').trim().toUpperCase();
    const name = (this.form.countryName || '').trim();
    const standard = Number(this.form.standard);
    const express = Number(this.form.express);

    if (!name) {
      this.formError = 'Country name is required.';
      return;
    }

    if (!/^[A-Z]{2}$/.test(code)) {
      this.formError = 'Country code must be exactly 2 letters (e.g. NG, US).';
      return;
    }

    if (Number.isNaN(standard) || standard < 0) {
      this.formError = 'Standard fee must be 0 or greater.';
      return;
    }

    if (Number.isNaN(express) || express < 0) {
      this.formError = 'Express fee must be 0 or greater.';
      return;
    }

    const payload: CreateShippingRateInput = {
      countryCode: code,
      countryName: name,
      standard,
      express,
      active: this.form.active !== false,
    };

    if (this.isEditMode) {
      if (!this.editingId) {
        this.formError = 'Missing rate id. Close and try again.';
        return;
      }

      this.shippingService.updateRate(this.editingId, payload).subscribe({
        next: (updated) => {
          if (updated) {
            this.closeFormModal();
          }
        },
      });
      return;
    }

    this.shippingService.createRate(payload).subscribe({
      next: (created) => {
        if (created) {
          this.closeFormModal();
        }
      },
    });
  }

  // ============================================================
  // TOGGLE
  // ============================================================

  toggleActive(rate: ShippingRate): void {
    const id = this.shippingService.rateId(rate);
    if (!id) {
      return;
    }

    const nextActive = rate.active === false;

    this.shippingService.updateRate(id, { active: nextActive }).subscribe();
  }

  // ============================================================
  // VIEW
  // ============================================================

  openViewModal(rate: ShippingRate): void {
    this.viewRate = rate;
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewRate = null;
    document.body.style.overflow = '';
  }

  editFromView(): void {
    if (!this.viewRate) {
      return;
    }

    const rate = this.viewRate;
    this.closeViewModal();
    this.openEditForm(rate);
  }

  // ============================================================
  // DELETE
  // ============================================================

  openDeleteModal(rate: ShippingRate): void {
    this.rateToDelete = rate;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.rateToDelete = null;
    document.body.style.overflow = '';
  }

  confirmDelete(): void {
    if (!this.rateToDelete) {
      return;
    }

    const id = this.shippingService.rateId(this.rateToDelete);
    if (!id) {
      return;
    }

    this.shippingService.deleteRate(id).subscribe({
      next: (ok) => {
        if (ok) {
          this.closeDeleteModal();
        }
      },
    });
  }

  // ============================================================
  // DISPLAY
  // ============================================================

  isActive(rate: ShippingRate): boolean {
    return rate.active !== false;
  }

  formatMoney(amount: number): string {
    return `$${(Number(amount) || 0).toFixed(2)}`;
  }

  formatDate(value?: string): string {
    if (!value) {
      return '—';
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return '—';
    }

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatDateTime(value?: string): string {
    if (!value) {
      return '—';
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return '—';
    }

    return d.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  private emptyForm(): CreateShippingRateInput {
    return {
      countryCode: '',
      countryName: '',
      standard: 0,
      express: 0,
      active: true,
    };
  }
}