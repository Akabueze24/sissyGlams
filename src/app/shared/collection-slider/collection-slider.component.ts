import { Component, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product-models/product.model';

@Component({
  selector: 'app-collection-slider',
  templateUrl: './collection-slider.component.html',
  styleUrls: ['./collection-slider.component.scss'],
})
export class CollectionSliderComponent {
  /**
   * Products to display in the slider.
   * Parent components pass this in.
   *
   * Examples:
   * - related products on product page
   * - new arrivals on home page
   * - best sellers on home page
   */
  @Input() products: Product[] = [];
}