import { Injectable } from '@angular/core';
import { Product } from '../../models/product-models/product.model';
import { PRODUCTS } from '../../data/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = PRODUCTS;

  constructor() { }

  getProducts():Product[]{
    return this.products;
  }

  getProductById(id: string):Product | undefined{
    return this.products.find(product => product.id === id)
  }

  getProductBySlug(slug: string):Product | undefined{
    return this.products.find(product => product.slug === slug)
  }

}
