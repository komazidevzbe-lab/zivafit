import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../_services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // ===============================
  // Page setup
  // Loads the logged-in customer's wishlist.
  // ===============================
  ngOnInit(): void {
    this.loadWishlist();
  }

  // ===============================
  // Load wishlist
  // Gets wishlist items from the backend.
  // ===============================
  loadWishlist() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.wishlistService.getWishlist().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not load your wishlist.';
      }
    });
  }

  // ===============================
  // Remove item
  // Removes a product from the logged-in customer's wishlist.
  // ===============================
  removeItem(productId: number) {
    this.errorMessage = '';
    this.successMessage = '';

    this.wishlistService.removeItem(productId).subscribe({
      next: () => {
        this.successMessage = 'Product removed from wishlist.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Could not remove wishlist item.';
      }
    });
  }
}