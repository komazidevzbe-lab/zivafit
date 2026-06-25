import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { WishlistItem } from '../_models/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  wishlistItems = signal<WishlistItem[]>([]);

  wishlistCount = computed(() => this.wishlistItems().length);

  // ===============================
  // Get wishlist
  // Loads the logged-in customer's saved products.
  // ===============================
  getWishlist() {
    return this.http.get<WishlistItem[]>(this.baseUrl + 'wishlist').pipe(
      tap(items => this.wishlistItems.set(items))
    );
  }

  // ===============================
  // Add item
  // Saves a product to the customer's wishlist.
  // ===============================
  addItem(productId: number) {
    return this.http.post<WishlistItem>(this.baseUrl + `wishlist/${productId}`, {}).pipe(
      tap(item => {
        const exists = this.wishlistItems().some(x => x.productId === item.productId);

        if (!exists) {
          this.wishlistItems.update(items => [item, ...items]);
        }
      })
    );
  }

  // ===============================
  // Remove item
  // Removes a product from the customer's wishlist.
  // ===============================
  removeItem(productId: number) {
    return this.http.delete<{ message: string }>(this.baseUrl + `wishlist/${productId}`).pipe(
      tap(() => {
        this.wishlistItems.update(items => items.filter(item => item.productId !== productId));
      })
    );
  }

  // ===============================
  // Is in wishlist
  // Helps product cards and details show the correct heart state.
  // ===============================
  isInWishlist(productId: number) {
    return this.wishlistItems().some(item => item.productId === productId);
  }

  // ===============================
  // Clear local wishlist state
  // Used when the user logs out.
  // ===============================
  clearLocalWishlist() {
    this.wishlistItems.set([]);
  }
}