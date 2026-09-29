import { Injectable } from '@angular/core';

/**
 * Pure pagination helpers.
 * Each page keeps its own currentPage / pageSize.
 * This service only does math + slicing — no global BehaviorSubjects.
 */
@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  /**
   * Items for the current page.
   */
  slicePage<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  /**
   * How many pages exist for this list size.
   */
  totalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize) || 1;
  }

  /**
   * First item index shown in the footer (1-based), or 0 if empty.
   */
  rangeStart(page: number, pageSize: number, totalItems: number): number {
    if (!totalItems) {
      return 0;
    }
    return (page - 1) * pageSize + 1;
  }

  /**
   * Last item index shown in the footer (1-based).
   */
  rangeEnd(page: number, pageSize: number, totalItems: number): number {
    return Math.min(page * pageSize, totalItems);
  }

  /**
   * Keep page in range after filters shrink the list.
   */
  clampPage(page: number, totalItems: number, pageSize: number): number {
    const max = this.totalPages(totalItems, pageSize);

    if (page > max) {
      return max;
    }

    if (page < 1) {
      return 1;
    }

    return page;
  }
}