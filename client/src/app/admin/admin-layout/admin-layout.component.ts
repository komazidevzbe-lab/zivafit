import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from '../../_services/account.service';

interface AdminNavLink {
  label: string;
  route: string;
  iconClass: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  private router = inject(Router);
  accountService = inject(AccountService);

  storeFrontLinks: AdminNavLink[] = [
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      iconClass: 'bi bi-house'
    },
    {
      label: 'Storefront Content',
      route: '/admin/storefront-content',
      iconClass: 'bi bi-window-sidebar'
    },
    {
      label: 'Product Catalog',
      route: '/admin/product-catalog',
      iconClass: 'bi bi-grid'
    }
  ];

  managementLinks: AdminNavLink[] = [
    {
      label: 'Orders',
      route: '/admin/order-management',
      iconClass: 'bi bi-bag-check'
    },
    {
      label: 'Customers',
      route: '/admin/customer-management',
      iconClass: 'bi bi-people'
    },
    {
      label: 'Reviews',
      route: '/admin/review-management',
      iconClass: 'bi bi-star'
    },
    {
      label: 'Newsletter',
      route: '/admin/newsletter-management',
      iconClass: 'bi bi-envelope'
    }
  ];

  get adminName(): string {
    const user = this.accountService.currentUser();

    if (!user)
      return 'ZivaFit Admin';

    return `${user.firstName} ${user.lastName}`.trim() || 'ZivaFit Admin';
  }

  get adminInitial(): string {
    return this.adminName.charAt(0).toUpperCase();
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}