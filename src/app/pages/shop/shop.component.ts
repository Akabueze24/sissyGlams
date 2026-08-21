import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductFilters } from 'src/app/core/models/product-models/product-filter.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  suggestedProducts: Product[] = [];

  filters: ProductFilters = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.applyFilters();
    this.suggestedProducts = this.productService.getFeaturedProducts(8);
  }

  /**
   * Central place to reload products from the service.
   * Any filter change should call this.
   */
  applyFilters(): void {
    this.products = this.productService.getProducts(this.filters);
  }

  /**
   * Called when the rating filter emits a value.
   */
  onRatingChange(rating: number | undefined): void {
    this.filters = {
      ...this.filters,
      rating,
    };

    this.applyFilters();
  }
}