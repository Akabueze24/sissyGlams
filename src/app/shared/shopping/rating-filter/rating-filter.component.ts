import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.scss'],
})
export class RatingFilterComponent {
  /**
   * Emits the selected minimum rating.
   * Emits undefined when the user clears the selection.
   */
  @Output() ratingChange = new EventEmitter<number | undefined>();

  selectedRating?: number;

  /**
   * Why toggle?
   * Clicking the same rating again clears the filter.
   * That feels natural for checkbox-style filters.
   */
  selectRating(rating: number): void {
    if (this.selectedRating === rating) {
      this.selectedRating = undefined;
    } else {
      this.selectedRating = rating;
    }

    this.ratingChange.emit(this.selectedRating);
  }
}