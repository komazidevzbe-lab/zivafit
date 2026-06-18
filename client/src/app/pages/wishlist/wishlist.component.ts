import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCatalogItem } from '../../_models/product-catalog';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  shopStateService = inject(ShopStateService);

  addToCart(product: ProductCatalogItem): void {
    this.shopStateService.addToCart(product.id, product.sizes[0] || 'One Size', 1);
  }

  removeFromWishlist(productId: number): void {
    this.shopStateService.removeFromWishlist(productId);
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }
}