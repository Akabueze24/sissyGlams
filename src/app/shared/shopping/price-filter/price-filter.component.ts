import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from 'src/app/core/services/product-service/product.service';

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
export class PriceFilterComponent implements OnInit {
  @Output() priceChange = new EventEmitter<PriceRange>();

  /** Limits from product data */
  absoluteMin = 0;
  absoluteMax = 100;

  /** Current selected values */
  minPrice = 0;
  maxPrice = 100;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const range = this.productService.getPriceRange();

    this.absoluteMin = range.min;
    this.absoluteMax = range.max;

    this.minPrice = range.min;
    this.maxPrice = range.max;
  }

  onMinChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.minPrice = Math.min(value, this.maxPrice);
    this.emitChange();
  }

  onMaxChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.maxPrice = Math.max(value, this.minPrice);
    this.emitChange();
  }

  private emitChange(): void {
    this.priceChange.emit({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }
}
