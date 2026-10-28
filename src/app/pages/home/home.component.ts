import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sissyFavorites: Product[] = [];
  newItems: Product[] = [];
  bestSellers: Product[] = [];
  ebooks: Product[] = [];

  private productsSub!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Re-run when API (or any update) pushes a new product list
    this.productsSub = this.productService.products$.subscribe(() => {
      this.sissyFavorites = this.productService.getFeaturedProducts(10);
      this.newItems = this.productService
        .getProductsByCollection('new-arrivals')
        .slice(0, 10);
      this.bestSellers = this.productService
        .getProductsByCollection('best-sellers')
        .slice(0, 10);
      this.ebooks = this.productService.getProductsByCategory('ebooks');
    });
  }

  ngOnDestroy(): void {
    this.productsSub?.unsubscribe();
  }
}