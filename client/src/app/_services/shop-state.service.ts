import { Injectable, computed, inject, signal } from '@angular/core';

import { CartItem, CartLine } from '../_models/shopping-state';
import { ProductCatalogItem } from '../_models/product-catalog';
import { ProductCatalogService } from './product-catalog.service';

@Injectable({
  providedIn: 'root'
})
export class ShopStateService {
  private productCatalogService = inject(ProductCatalogService);

  private readonly cartStorageKey = 'zivafit-cart-items';
  private readonly wishlistStorageKey = 'zivafit-wishlist-product-ids';

  cartItems = signal<CartItem[]>(this.loadCartItems());
  wishlistProductIds = signal<number[]>(this.loadWishlistIds());

  constructor() {
    // ===============================
    // Load products for cart/wishlist state
    // Cart and wishlist still use localStorage in this phase.
    // The product details now come from the backend product catalogue.
    // ===============================
    this.productCatalogService.loadProducts().subscribe();
  }

  cartLines = computed<CartLine[]>(() => {
    return this.cartItems()
      .map(item => {
        const product = this.getProductById(item.productId);

        if (!product)
          return null;

        return {
          product,
          size: item.size,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
          lineTotalText: this.formatPrice(product.price * item.quantity)
        };
      })
      .filter((line): line is CartLine => line !== null);
  });

  wishlistProducts = computed<ProductCatalogItem[]>(() => {
    return this.wishlistProductIds()
      .map(productId => this.getProductById(productId))
      .filter((product): product is ProductCatalogItem => product !== undefined);
  });

  cartCount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  wishlistCount = computed(() => {
    return this.wishlistProductIds().length;
  });

  cartSubtotal = computed(() => {
    return this.cartLines().reduce((total, line) => total + line.lineTotal, 0);
  });

  cartSubtotalText = computed(() => {
    return this.formatPrice(this.cartSubtotal());
  });

  deliveryFee = computed(() => {
    if (this.cartSubtotal() === 0)
      return 0;

    return this.cartSubtotal() >= 1000 ? 0 : 99;
  });

  deliveryFeeText = computed(() => {
    return this.deliveryFee() === 0 ? 'Free' : this.formatPrice(this.deliveryFee());
  });

  cartTotal = computed(() => {
    return this.cartSubtotal() + this.deliveryFee();
  });

  cartTotalText = computed(() => {
    return this.formatPrice(this.cartTotal());
  });

  addToCart(productId: number, size: string, quantity = 1): void {
    const selectedSize = size || 'One Size';

    const existingItem = this.cartItems().find(
      item => item.productId === productId && item.size === selectedSize
    );

    if (existingItem) {
      this.cartItems.set(
        this.cartItems().map(item =>
          item.productId === productId && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      this.cartItems.set([
        ...this.cartItems(),
        {
          productId,
          size: selectedSize,
          quantity
        }
      ]);
    }

    this.saveCartItems();
  }

  increaseCartQuantity(productId: number, size: string): void {
    this.cartItems.set(
      this.cartItems().map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    this.saveCartItems();
  }

  decreaseCartQuantity(productId: number, size: string): void {
    this.cartItems.set(
      this.cartItems()
        .map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    this.saveCartItems();
  }

  removeFromCart(productId: number, size: string): void {
    this.cartItems.set(
      this.cartItems().filter(item => !(item.productId === productId && item.size === size))
    );

    this.saveCartItems();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartItems();
  }

  toggleWishlist(productId: number): void {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
      return;
    }

    this.wishlistProductIds.set([...this.wishlistProductIds(), productId]);
    this.saveWishlistIds();
  }

  removeFromWishlist(productId: number): void {
    this.wishlistProductIds.set(this.wishlistProductIds().filter(id => id !== productId));
    this.saveWishlistIds();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().includes(productId);
  }

  getProductById(productId: number): ProductCatalogItem | undefined {
    return this.productCatalogService.getProductById(productId);
  }

  private loadCartItems(): CartItem[] {
    try {
      const storedItems = localStorage.getItem(this.cartStorageKey);

      if (!storedItems)
        return [];

      return JSON.parse(storedItems) as CartItem[];
    } catch {
      return [];
    }
  }

  private saveCartItems(): void {
    localStorage.setItem(this.cartStorageKey, JSON.stringify(this.cartItems()));
  }

  private loadWishlistIds(): number[] {
    try {
      const storedIds = localStorage.getItem(this.wishlistStorageKey);

      if (!storedIds)
        return [];

      return JSON.parse(storedIds) as number[];
    } catch {
      return [];
    }
  }

  private saveWishlistIds(): void {
    localStorage.setItem(this.wishlistStorageKey, JSON.stringify(this.wishlistProductIds()));
  }

  private formatPrice(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', {
      maximumFractionDigits: 0
    }).replace(/,/g, ' ')}`;
  }
}