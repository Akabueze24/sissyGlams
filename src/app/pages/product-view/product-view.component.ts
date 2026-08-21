import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductColor } from 'src/app/core/models/product-models/product-color.model';
import { ProductLength } from 'src/app/core/models/product-models/product-length.model';
import { Product } from 'src/app/core/models/product-models/product.model';
import { ProductSize } from 'src/app/core/models/product-models/size.model';

import { CartService } from 'src/app/core/services/cart-service/cart.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { WishlistService } from 'src/app/core/services/wishlist-service/wishlist.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit, OnDestroy {
  // ============================================================
  // PRODUCT STATE
  // ============================================================

  product?: Product;
  relatedProducts: Product[] = [];
  productNotFound = false;

  // ============================================================
  // SELECTION STATE
  // ============================================================

  selectedColor?: ProductColor;
  selectedSize?: ProductSize;
  selectedLength?: ProductLength;

  galleryImages: string[] = [];
  quantity = 1;
  isWishlisted = false;

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  private routeSubscription!: Subscription;
  private wishlistSubscription!: Subscription;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.loadProduct(slug);
    });

    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe(
      () => {
        if (this.product) {
          this.isWishlisted = this.wishlistService.isInWishlist(this.product);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  private loadProduct(slug: string | null): void {
    this.product = undefined;
    this.relatedProducts = [];
    this.productNotFound = false;
    this.selectedColor = undefined;
    this.selectedSize = undefined;
    this.selectedLength = undefined;
    this.galleryImages = [];
    this.quantity = 1;
    this.isWishlisted = false;

    if (!slug) {
      this.productNotFound = true;
      return;
    }

    const found = this.productService.getProductBySlug(slug);

    if (!found) {
      this.productNotFound = true;
      return;
    }

    this.product = found;
    this.productNotFound = false;

    this.isWishlisted = this.wishlistService.isInWishlist(this.product);

    if (this.product.colors?.length) {
      this.selectedColor = this.product.colors[0];
    }

    if (this.product.sizes?.length) {
      this.selectedSize = this.product.sizes[0];
    }

    if (this.product.lengths?.length) {
      this.selectedLength = this.product.lengths[0];
    }

    this.updateGallery();

    this.relatedProducts = this.productService.getRelatedProducts(
      this.product,
      8
    );
  }

  // ============================================================
  // GALLERY + SELECTION
  // ============================================================

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    this.updateGallery();
  }

  updateGallery(): void {
    if (!this.product) {
      this.galleryImages = [];
      return;
    }

    if (!this.product.colorGalleries || !this.selectedColor) {
      this.galleryImages = this.product.images ?? [];
      return;
    }

    const gallery = this.product.colorGalleries.find(
      (item) => item.color.value === this.selectedColor?.value
    );

    this.galleryImages = gallery?.images ?? this.product.images;
  }

  selectSize(size: ProductSize): void {
    this.selectedSize = size;
  }

  selectLength(length: ProductLength): void {
    this.selectedLength = length;
  }

  // ============================================================
  // QUANTITY
  // ============================================================

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // ============================================================
  // CART
  // ============================================================

  addToCart(): void {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart({
      product: this.product,
      quantity: this.quantity,
      color: this.selectedColor,
      size: this.selectedSize,
      length: this.selectedLength,
    });
  }

  // ============================================================
  // WISHLIST
  // ============================================================

  toggleWishlist(): void {
    if (!this.product) {
      return;
    }

    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }

    this.isWishlisted = this.wishlistService.isInWishlist(this.product);
  }
}