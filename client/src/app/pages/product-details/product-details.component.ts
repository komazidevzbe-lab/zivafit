import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductCatalogImage, ProductCatalogItem } from '../../_models/product-catalog';
import { ProductCatalogService } from '../../_services/product-catalog.service';
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
  private productCatalogService = inject(ProductCatalogService);

  private routeSubscription?: Subscription;
  private productSubscription?: Subscription;
  private relatedSubscription?: Subscription;

  shopStateService = inject(ShopStateService);

  product?: ProductCatalogItem;
  relatedProducts: ProductCatalogItem[] = [];

  selectedSize = '';
  selectedQuantity = 1;
  selectedImageUrl = '';

  successMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.loadProduct(productId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.relatedSubscription?.unsubscribe();
  }

  get isWishlisted(): boolean {
    if (!this.product)
      return false;

    return this.shopStateService.isInWishlist(this.product.id);
  }

  // ===============================
  // Load product
  // Loads Product Details from the API by product ID.
  // The route uses /product-details/:id and does not use slugs.
  // ===============================
  private loadProduct(productId: number): void {
    if (!productId) {
      this.product = undefined;
      return;
    }

    this.isLoading = true;
    this.product = undefined;
    this.relatedProducts = [];
    this.successMessage = '';
    this.selectedQuantity = 1;

    this.productSubscription?.unsubscribe();

    this.productSubscription = this.productCatalogService.getProductByIdFromApi(productId).subscribe({
      next: product => {
        this.product = product;
        this.selectedSize = product.sizes[0] || 'One Size';
        this.selectedImageUrl = product.imageUrl;
        this.isLoading = false;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadRelatedProducts(product);
      },
      error: () => {
        this.product = undefined;
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Load related products
  // Uses the same category as the current product.
  // ===============================
  private loadRelatedProducts(product: ProductCatalogItem): void {
    this.relatedSubscription?.unsubscribe();

    this.relatedSubscription = this.productCatalogService.getProductsByCategory(product.category).subscribe({
      next: products => {
        this.relatedProducts = products
          .filter(item => item.id !== product.id)
          .slice(0, 4);
      },
      error: () => {
        this.relatedProducts = [];
      }
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.successMessage = '';
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
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
  }

  toggleRelatedWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }

  trackByImageId(index: number, image: ProductCatalogImage): number {
    return image.id;
  }

  trackBySize(index: number, size: string): string {
    return size;
  }
}