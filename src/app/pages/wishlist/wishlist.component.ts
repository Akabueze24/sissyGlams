import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product-models/product.model';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe((items) => {
      this.wishlistItems = items;
    });
  }
}
