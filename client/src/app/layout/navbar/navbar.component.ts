import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { CartService } from '../../_services/cart.service';
import { WishlistService } from '../../_services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  accountService = inject(AccountService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  private router = inject(Router);

  searchOpen = false;
  searchTerm = '';

  publicLinks = [
    { label: 'New In', route: '/new-in' },
    { label: 'Shop', route: '/shop' },
    { label: 'Leggings', route: '/leggings' },
    { label: 'Sports Bras', route: '/sports-bras' },
    { label: 'Tops', route: '/tops' },
    { label: 'Sets', route: '/sets' },
    { label: 'Shorts', route: '/shorts' },
    { label: 'Accessories', route: '/accessories' }
  ];

  // ===============================
  // Page setup
  // Loads cart and wishlist counts when a logged-in customer opens the site.
  // ===============================
  ngOnInit(): void {
    if (!this.accountService.currentUser()) {
      return;
    }

    this.cartService.getCart().subscribe({
      error: () => this.cartService.clearLocalCart()
    });

    this.wishlistService.getWishlist().subscribe({
      error: () => this.wishlistService.clearLocalWishlist()
    });
  }

  // ===============================
  // Toggle search
  // Only logged-in customers can open search.
  // ===============================
  toggleSearch() {
    if (!this.accountService.isLoggedIn()) {
      this.searchOpen = false;
      this.searchTerm = '';
      this.router.navigateByUrl('/login');
      return;
    }

    this.searchOpen = !this.searchOpen;

    if (!this.searchOpen) {
      this.searchTerm = '';
    }
  }

  // ===============================
  // Logout
  // Clears auth, cart, wishlist, and returns to home.
  // ===============================
  logout() {
    this.searchOpen = false;
    this.searchTerm = '';

    this.cartService.clearLocalCart();
    this.wishlistService.clearLocalWishlist();

    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}