import { Component, Input, OnInit } from '@angular/core';

import { Product } from 'src/app/core/models/product-models/product.model';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  @Input() wishlistMode = false;

  isWishlisted = false;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.isWishlisted = this.wishlistService.isInWishlist(this.product);

    this.wishlistService.wishlistItems$.subscribe(() => {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product);
    });
  }

  toggleWishlist(): void {
    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  removeFromWishlist(): void {
    this.wishlistService.removeFromWishlist(this.product);
  }
}
