import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  // 1. Fully private state
  private currentPageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(12);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  // 2. Public read-only Observables for components
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();
  pageSize$: Observable<number> = this.pageSizeSubject.asObservable();
  totalItems$: Observable<number> = this.totalItemsSubject.asObservable();

  // 3. Getters for snapshot reads
  get currentPage(): number {
    return this.currentPageSubject.value;
  }

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  get totalItems(): number {
    return this.totalItemsSubject.value;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  // 4. Public methods to safely update private state
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageSubject.next(page);
    }
  }

  setPageSize(size: number): void {
    this.pageSizeSubject.next(size);
    this.currentPageSubject.next(1); // Reset to page 1 on size change
  }

  setTotalItems(total: number): void {
    this.totalItemsSubject.next(total);
  }

  reset(): void {
    this.currentPageSubject.next(1);
  }
}