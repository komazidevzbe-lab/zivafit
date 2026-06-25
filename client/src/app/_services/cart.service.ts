import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AddCartItem, Cart, UpdateCartItem } from '../_models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  currentCart = signal<Cart>(this.getEmptyCart());

  cartCount = computed(() => this.currentCart().totalItems);

  getCart() {
    return this.http.get<Cart>(this.baseUrl + 'cart').pipe(
      tap(cart => this.currentCart.set(cart))
    );
  }

  addItem(model: AddCartItem) {
    return this.http.post<Cart>(this.baseUrl + 'cart/items', model).pipe(
      tap(cart => this.currentCart.set(cart))
    );
  }

  updateItem(cartItemId: number, model: UpdateCartItem) {
    return this.http.put<Cart>(this.baseUrl + `cart/items/${cartItemId}`, model).pipe(
      tap(cart => this.currentCart.set(cart))
    );
  }

  removeItem(cartItemId: number) {
    return this.http.delete<Cart>(this.baseUrl + `cart/items/${cartItemId}`).pipe(
      tap(cart => this.currentCart.set(cart))
    );
  }

  clearCart() {
    return this.http.delete<Cart>(this.baseUrl + 'cart').pipe(
      tap(cart => this.currentCart.set(cart))
    );
  }

  clearLocalCart() {
    this.currentCart.set(this.getEmptyCart());
  }

  private getEmptyCart(): Cart {
    return {
      items: [],
      totalItems: 0,

      subtotalAmount: 0,
      subtotalText: 'R0.00',

      deliveryMethod: '',
      deliveryMessage: '',
      deliveryRuleText: '',

      deliveryFee: 0,
      deliveryFeeText: 'Free',

      freeDeliveryThreshold: 0,
      freeDeliveryThresholdText: 'R0.00',

      amountUntilFreeDelivery: 0,
      amountUntilFreeDeliveryText: 'R0.00',

      isFreeDelivery: false,

      totalAmount: 0,
      totalText: 'R0.00'
    };
  }
}