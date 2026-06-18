import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  shopStateService = inject(ShopStateService);

  private router = inject(Router);

  searchOpen = false;
  searchTerm = '';
  profileMenuOpen = false;

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

  toggleSearch() {
    if (!this.accountService.isLoggedIn()) {
      this.searchOpen = false;
      this.searchTerm = '';
      this.profileMenuOpen = false;
      this.router.navigateByUrl('/login');
      return;
    }

    this.profileMenuOpen = false;
    this.searchOpen = !this.searchOpen;

    if (!this.searchOpen) {
      this.searchTerm = '';
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;

    if (this.profileMenuOpen) {
      this.searchOpen = false;
      this.searchTerm = '';
    }
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  logout() {
    this.searchOpen = false;
    this.searchTerm = '';
    this.profileMenuOpen = false;

    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}