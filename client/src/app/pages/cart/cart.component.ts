import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CartItem } from '../../_models/cart';
import { CartService } from '../../_services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);

  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // ===============================
  // Page setup
  // Loads the database cart when the page opens.
  // ===============================
  ngOnInit(): void {
    this.loadCart();
  }

  // ===============================
  // Load cart
  // Gets the logged-in customer's cart from the backend.
  // ===============================
  loadCart() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.getCart().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not load your cart.';
      }
    });
  }

  // ===============================
  // Increase quantity
  // Updates the selected cart item quantity.
  // ===============================
  increaseQuantity(item: CartItem) {
    if (item.quantity >= item.availableStock) {
      this.errorMessage = 'You cannot add more than the available stock.';
      return;
    }

    this.updateQuantity(item, item.quantity + 1);
  }

  // ===============================
  // Decrease quantity
  // Updates the selected cart item quantity.
  // ===============================
  decreaseQuantity(item: CartItem) {
    if (item.quantity <= 1) {
      return;
    }

    this.updateQuantity(item, item.quantity - 1);
  }

  // ===============================
  // Remove item
  // Removes an item from the database cart.
  // ===============================
  removeItem(item: CartItem) {
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.removeItem(item.id).subscribe({
      next: () => {
        this.successMessage = 'Item removed from cart.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Could not remove item.';
      }
    });
  }

  // ===============================
  // Clear cart
  // Removes all items from the database cart.
  // ===============================
  clearCart() {
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.clearCart().subscribe({
      next: () => {
        this.successMessage = 'Cart cleared.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Could not clear cart.';
      }
    });
  }

  // ===============================
  // Go to checkout
  // Sends the customer to checkout only when cart has items.
  // ===============================
  goToCheckout() {
    if (this.cartService.currentCart().items.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    this.router.navigateByUrl('/checkout');
  }

  private updateQuantity(item: CartItem, quantity: number) {
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.updateItem(item.id, { quantity }).subscribe({
      error: error => {
        this.errorMessage = error?.error?.message || 'Could not update cart item.';
      }
    });
  }
}