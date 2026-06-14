import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  accountService = inject(AccountService);
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
  // Toggle search
  // Only logged-in customers can open search.
  // Product filtering will be connected later.
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
  // Clears the token through AccountService and returns to home.
  // ===============================
  logout() {
    this.searchOpen = false;
    this.searchTerm = '';

    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}