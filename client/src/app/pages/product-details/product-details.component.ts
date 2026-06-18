import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductCatalogItem } from '../../_models/product-catalog';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private viewportScroller = inject(ViewportScroller);
  private routeSubscription?: Subscription;

  shopStateService = inject(ShopStateService);

  product?: ProductCatalogItem;
  relatedProducts: ProductCatalogItem[] = [];

  selectedSize = '';
  selectedQuantity = 1;
  selectedImageUrl = '';

  successMessage = '';

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.loadProduct(productId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  get isWishlisted(): boolean {
    if (!this.product)
      return false;

    return this.shopStateService.isInWishlist(this.product.id);
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.successMessage = '';
  }

  increaseQuantity(): void {
    this.selectedQuantity++;
    this.successMessage = '';
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity <= 1)
      return;

    this.selectedQuantity--;
    this.successMessage = '';
  }

  addToCart(): void {
    if (!this.product)
      return;

    this.shopStateService.addToCart(
      this.product.id,
      this.selectedSize,
      this.selectedQuantity
    );

    this.successMessage = `${this.product.name} has been added to your cart.`;
  }

  toggleWishlist(): void {
    if (!this.product)
      return;

    this.shopStateService.toggleWishlist(this.product.id);

    this.successMessage = this.isWishlisted
      ? `${this.product.name} has been added to your wishlist.`
      : `${this.product.name} has been removed from your wishlist.`;
  }

  toggleRelatedWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }

  trackBySize(index: number, size: string): string {
    return size;
  }

  private loadProduct(productId: number): void {
    this.successMessage = '';
    this.selectedQuantity = 1;
    this.selectedSize = '';
    this.selectedImageUrl = '';
    this.relatedProducts = [];
    this.product = undefined;

    if (!productId)
      return;

    const selectedProduct = this.shopStateService.getProductById(productId);

    if (!selectedProduct)
      return;

    this.product = selectedProduct;
    this.selectedSize = selectedProduct.sizes[0] || 'One Size';
    this.selectedImageUrl = selectedProduct.imageUrl;
    this.relatedProducts = this.shopStateService.getRelatedProducts(selectedProduct, 4);

    setTimeout(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}