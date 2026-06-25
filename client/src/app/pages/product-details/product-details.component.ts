import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  ProductCatalogImage,
  ProductCatalogItem,
  ProductCatalogVariant
} from '../../_models/product-catalog';

import { AccountService } from '../../_services/account.service';
import { CartService } from '../../_services/cart.service';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { WishlistService } from '../../_services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private productCatalogService = inject(ProductCatalogService);
  private accountService = inject(AccountService);
  private cartService = inject(CartService);

  wishlistService = inject(WishlistService);

  private routeSubscription?: Subscription;
  private productSubscription?: Subscription;
  private relatedSubscription?: Subscription;
  private addCartSubscription?: Subscription;
  private wishlistSubscription?: Subscription;
  private loadWishlistSubscription?: Subscription;

  product?: ProductCatalogItem;
  relatedProducts: ProductCatalogItem[] = [];

  selectedSize = '';
  selectedQuantity = 1;
  selectedImageUrl = '';

  successMessage = '';
  errorMessage = '';
  isLoading = false;
  isAddingToCart = false;
  isUpdatingWishlist = false;

  // ===============================
  // Page setup
  // Loads product details whenever the route ID changes.
  // Also loads wishlist state for logged-in customers.
  // ===============================
  ngOnInit(): void {
    if (this.accountService.currentUser()) {
      this.loadWishlistSubscription = this.wishlistService.getWishlist().subscribe({
        error: () => this.wishlistService.clearLocalWishlist()
      });
    }

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.loadProduct(productId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.relatedSubscription?.unsubscribe();
    this.addCartSubscription?.unsubscribe();
    this.wishlistSubscription?.unsubscribe();
    this.loadWishlistSubscription?.unsubscribe();
  }

  get isWishlisted(): boolean {
    if (!this.product)
      return false;

    return this.wishlistService.isInWishlist(this.product.id);
  }

  get productImages(): ProductCatalogImage[] {
    return this.product?.images || [];
  }

  get availableVariants(): ProductCatalogVariant[] {
    if (!this.product?.variants)
      return [];

    return this.product.variants
      .filter(variant => variant.isActive && variant.stockQuantity > 0)
      .sort((a, b) => this.getSizeOrder(a.size) - this.getSizeOrder(b.size));
  }

  get availableSizes(): string[] {
    if (this.availableVariants.length > 0) {
      return this.availableVariants
        .map(variant => variant.size)
        .filter((size, index, sizes) => sizes.indexOf(size) === index);
    }

    return this.product?.sizes || [];
  }

  get selectedVariant(): ProductCatalogVariant | undefined {
    return this.availableVariants.find(variant => variant.size === this.selectedSize);
  }

  get selectedStock(): number {
    return this.selectedVariant?.stockQuantity ?? 0;
  }

  get canAddToCart(): boolean {
    return !!this.product &&
      !!this.selectedVariant &&
      this.selectedQuantity >= 1 &&
      this.selectedQuantity <= this.selectedStock &&
      !this.isAddingToCart;
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
    this.errorMessage = '';
    this.selectedQuantity = 1;

    this.productSubscription?.unsubscribe();

    this.productSubscription = this.productCatalogService.getProductByIdFromApi(productId).subscribe({
      next: product => {
        this.product = product;
        this.selectedImageUrl = product.imageUrl;
        this.setDefaultSize(product);
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

  // ===============================
  // Select size
  // Selects the customer-facing size and matches it to a backend variant.
  // ===============================
  selectSize(size: string): void {
    this.selectedSize = size;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedStock > 0 && this.selectedQuantity > this.selectedStock) {
      this.selectedQuantity = this.selectedStock;
    }
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  // ===============================
  // Quantity controls
  // Keeps quantity within the selected variant stock.
  // ===============================
  increaseQuantity(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedVariant) {
      this.errorMessage = 'Please select an available size first.';
      return;
    }

    if (this.selectedQuantity >= this.selectedStock) {
      this.errorMessage = 'You cannot add more than the available stock for this size.';
      return;
    }

    this.selectedQuantity++;
  }

  decreaseQuantity(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedQuantity <= 1)
      return;

    this.selectedQuantity--;
  }

  // ===============================
  // Add to cart
  // Saves the selected product variant to the backend database cart.
  // This replaces the old local ShopStateService cart behaviour.
  // ===============================
  addToCart(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.product)
      return;

    if (!this.accountService.currentUser()) {
      this.router.navigateByUrl('/login');
      return;
    }

    const variant = this.selectedVariant;

    if (!variant) {
      this.errorMessage = 'Please select an available size before adding this product to your cart.';
      return;
    }

    if (this.selectedQuantity < 1) {
      this.errorMessage = 'Quantity must be at least 1.';
      return;
    }

    if (this.selectedQuantity > variant.stockQuantity) {
      this.errorMessage = 'The selected quantity is more than the available stock.';
      return;
    }

    this.isAddingToCart = true;

    this.addCartSubscription?.unsubscribe();

    this.addCartSubscription = this.cartService.addItem({
      productId: this.product.id,
      productVariantId: variant.id,
      quantity: this.selectedQuantity
    }).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.successMessage = `${this.product?.name} has been added to your cart.`;
      },
      error: error => {
        this.isAddingToCart = false;
        this.errorMessage = error?.error?.message || 'Could not add this product to your cart.';
      }
    });
  }

  // ===============================
  // Toggle wishlist
  // Saves or removes the product from the backend wishlist.
  // ===============================
  toggleWishlist(): void {
    if (!this.product)
      return;

    if (!this.accountService.currentUser()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.toggleWishlistByProductId(this.product.id);
  }

  toggleRelatedWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.accountService.currentUser()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.toggleWishlistByProductId(productId);
  }

  isRelatedWishlisted(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
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

  private toggleWishlistByProductId(productId: number): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isUpdatingWishlist = true;

    this.wishlistSubscription?.unsubscribe();

    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistSubscription = this.wishlistService.removeItem(productId).subscribe({
        next: () => {
          this.isUpdatingWishlist = false;
          this.successMessage = 'Product removed from wishlist.';
        },
        error: error => {
          this.isUpdatingWishlist = false;
          this.errorMessage = error?.error?.message || 'Could not update wishlist.';
        }
      });

      return;
    }

    this.wishlistSubscription = this.wishlistService.addItem(productId).subscribe({
      next: () => {
        this.isUpdatingWishlist = false;
        this.successMessage = 'Product added to wishlist.';
      },
      error: error => {
        this.isUpdatingWishlist = false;
        this.errorMessage = error?.error?.message || 'Could not update wishlist.';
      }
    });
  }

  private setDefaultSize(product: ProductCatalogItem): void {
    const firstAvailableVariant = (product.variants || [])
      .filter(variant => variant.isActive && variant.stockQuantity > 0)
      .sort((a, b) => this.getSizeOrder(a.size) - this.getSizeOrder(b.size))[0];

    this.selectedSize = firstAvailableVariant?.size || product.sizes[0] || 'One Size';
  }

  private getSizeOrder(size: string): number {
    switch (size.toUpperCase()) {
      case 'XXS':
        return 1;
      case 'XS':
        return 2;
      case 'S':
        return 3;
      case 'M':
        return 4;
      case 'L':
        return 5;
      case 'XL':
        return 6;
      case 'XXL':
        return 7;
      case 'ONE SIZE':
        return 8;
      default:
        return 99;
    }
  }
}