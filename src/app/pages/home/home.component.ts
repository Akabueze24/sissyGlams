import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sissyFavorites: Product[] = [];
  newItems: Product[] = [];
  bestSellers: Product[] = [];
  ebooks: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.sissyFavorites = this.productService.getFeaturedProducts(10);
    this.newItems = this.productService
      .getProductsByCollection('new-arrivals')
      .slice(0, 10);
    this.bestSellers = this.productService
      .getProductsByCollection('best-sellers')
      .slice(0, 10);
    this.ebooks = this.productService.getProductsByCategory('ebooks');
  }
}
