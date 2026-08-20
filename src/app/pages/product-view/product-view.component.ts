import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class ProductViewComponent implements OnInit {
  product?: Product;
  selectedColor?: ProductColor;
  selectedSize?: ProductSize;
  selectedLength?: ProductLength;

  galleryImages: string[] = [];
  quantity = 1;
  isWishlisted = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private wishlistService: WishlistService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.product = this.productService.getProductBySlug(slug);

      if (this.product) {
        this.isWishlisted = this.wishlistService.isInWishlist(this.product);
      }

      if (this.product?.colors?.length) {
        this.selectedColor = this.product.colors[0];

        this.updateGallery();
      }
      if (this.product?.sizes?.length) {
        this.selectedSize = this.product.sizes[0];
      }
      if (this.product?.lengths) {
        this.selectedLength = this.product.lengths[0];
      }
    }
    this.wishlistService.wishlistItems$.subscribe(() => {
      if (this.product) {
        this.isWishlisted = this.wishlistService.isInWishlist(this.product);
      }
    });
  }

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    this.updateGallery();
  }

  updateGallery(): void {
    if (!this.product?.colorGalleries || !this.selectedColor) {
      this.galleryImages = this.product?.images ?? [];
      return;
    }

    const gallery = this.product.colorGalleries.find(
      (gallery) => gallery.color.value === this.selectedColor?.value,
    );

    this.galleryImages = gallery?.images ?? this.product.images;
  }

  selectSize(size: ProductSize): void {
    this.selectedSize = size;
  }

  selectLength(length: ProductLength): void {
    this.selectedLength = length;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

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

  toggleWishlist(): void {
    if (!this.product) {
      return;
    }

    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product);
      this.isWishlisted = false;
    } else {
      this.wishlistService.addToWishlist(this.product);
      this.isWishlisted = true;
    }
  }
}
