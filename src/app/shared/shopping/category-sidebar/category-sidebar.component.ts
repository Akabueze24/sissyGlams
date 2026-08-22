import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoryNavItem } from 'src/app/core/models/product-models/category-nav-item.model';
import { Category } from 'src/app/core/models/product-models/category.model';
import { ProductService } from 'src/app/core/services/product-service/product.service';

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss'],
})
export class CategorySidebarComponent implements OnInit, OnDestroy {
  categoryNav: CategoryNavItem[] = [];

  activeCategory: string | null = null;
  activeSubcategory: string | null = null;
  activeCollection: string | null = null;

  private queryParamsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryNav = this.productService.getCategoryNav();

    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      this.activeCategory = params['category'] || null;
      this.activeSubcategory = params['subcategory'] || null;
      this.activeCollection = params['collection'] || null;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  isCategoryActive(category: Category): boolean {
    return this.activeCategory === category;
  }

  isSubcategoryActive(subcategorySlug: string): boolean {
    return this.activeSubcategory === subcategorySlug;
  }

  isNewActive(): boolean {
    return this.activeCollection === 'new-arrivals';
  }
}