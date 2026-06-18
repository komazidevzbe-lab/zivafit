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
    if (this.cartLines().length === 0)
      return 0;

    return this.cartSubtotal() >= 1000 ? 0 : 99;
  });

  deliveryFeeText = computed(() => {
    if (this.cartLines().length === 0)
      return this.formatPrice(0);

    return this.deliveryFee() === 0 ? 'Free' : this.formatPrice(this.deliveryFee());
  });

  cartTotal = computed(() => {
    return this.cartSubtotal() + this.deliveryFee();
  });

  cartTotalText = computed(() => {
    return this.formatPrice(this.cartTotal());
  });

  getProductById(productId: number): ProductCatalogItem | undefined {
    return this.productCatalogService
      .getProducts()
      .find(product => product.id === productId);
  }

  getRelatedProducts(product: ProductCatalogItem, limit = 4): ProductCatalogItem[] {
    return this.productCatalogService
      .getProductsByCategory(product.category)
      .filter(relatedProduct => relatedProduct.id !== product.id)
      .slice(0, limit);
  }

  addToCart(productId: number, size: string, quantity = 1): void {
    const product = this.getProductById(productId);

    if (!product)
      return;

    const cleanSize = size || product.sizes[0] || 'One Size';
    const cleanQuantity = Math.max(1, quantity);

    const existingItems = this.cartItems();
    const existingItem = existingItems.find(
      item => item.productId === productId && item.size === cleanSize
    );

    if (existingItem) {
      this.cartItems.set(
        existingItems.map(item =>
          item.productId === productId && item.size === cleanSize
            ? { ...item, quantity: item.quantity + cleanQuantity }
            : item
        )
      );
    } else {
      this.cartItems.set([
        ...existingItems,
        {
          productId,
          size: cleanSize,
          quantity: cleanQuantity
        }
      ]);
    }

    this.saveCartItems();
  }

  updateCartQuantity(productId: number, size: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, size);
      return;
    }

    this.cartItems.set(
      this.cartItems().map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );

    this.saveCartItems();
  }

  increaseCartQuantity(productId: number, size: string): void {
    const item = this.cartItems().find(
      cartItem => cartItem.productId === productId && cartItem.size === size
    );

    if (!item)
      return;

    this.updateCartQuantity(productId, size, item.quantity + 1);
  }

  decreaseCartQuantity(productId: number, size: string): void {
    const item = this.cartItems().find(
      cartItem => cartItem.productId === productId && cartItem.size === size
    );

    if (!item)
      return;

    this.updateCartQuantity(productId, size, item.quantity - 1);
  }

  removeFromCart(productId: number, size: string): void {
    this.cartItems.set(
      this.cartItems().filter(item =>
        !(item.productId === productId && item.size === size)
      )
    );

    this.saveCartItems();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartItems();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().includes(productId);
  }

  addToWishlist(productId: number): void {
    const product = this.getProductById(productId);

    if (!product || this.isInWishlist(productId))
      return;

    this.wishlistProductIds.set([...this.wishlistProductIds(), productId]);
    this.saveWishlistIds();
  }

  removeFromWishlist(productId: number): void {
    this.wishlistProductIds.set(
      this.wishlistProductIds().filter(id => id !== productId)
    );

    this.saveWishlistIds();
  }

  toggleWishlist(productId: number): void {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
      return;
    }

    this.addToWishlist(productId);
  }

  private loadCartItems(): CartItem[] {
    try {
      const storedItems = localStorage.getItem(this.cartStorageKey);

      if (!storedItems)
        return [];

      const parsedItems = JSON.parse(storedItems);

      if (!Array.isArray(parsedItems))
        return [];

      return parsedItems
        .filter(item =>
          typeof item.productId === 'number' &&
          typeof item.size === 'string' &&
          typeof item.quantity === 'number'
        )
        .map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: Math.max(1, item.quantity)
        }));
    } catch {
      return [];
    }
  }

  private loadWishlistIds(): number[] {
    try {
      const storedIds = localStorage.getItem(this.wishlistStorageKey);

      if (!storedIds)
        return [];

      const parsedIds = JSON.parse(storedIds);

      if (!Array.isArray(parsedIds))
        return [];

      return parsedIds.filter(id => typeof id === 'number');
    } catch {
      return [];
    }
  }

  private saveCartItems(): void {
    localStorage.setItem(this.cartStorageKey, JSON.stringify(this.cartItems()));
  }

  private saveWishlistIds(): void {
    localStorage.setItem(this.wishlistStorageKey, JSON.stringify(this.wishlistProductIds()));
  }

  private formatPrice(price: number): string {
    return `R${price.toLocaleString('en-ZA').replace(',', ' ')}`;
  }
}