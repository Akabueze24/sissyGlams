import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 12;
  @Input() totalItems: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 1;
  displayedPages: (number | string)[] = [];

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.displayedPages = this.generatePageNumbers();
  }

  onPageSelect(page: number | string, event: Event): void {
    event.preventDefault();

    if (typeof page === 'number' && page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  private generatePageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    // Show all if 7 or fewer total pages
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Near beginning: 1 2 3 4 5 ... total
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    // Near end: 1 ... (total - 4) (total - 3) (total - 2) (total - 1) total
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    // Middle window: 1 ... (current - 1) current (current + 1) ... total
    return [1, '...', current - 1, current, current + 1, '...', total];
  }
}