import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  summaryCards = [
    {
      label: 'Products',
      value: '3',
      text: 'Mock catalogue items',
      iconClass: 'bi bi-grid'
    },
    {
      label: 'Orders',
      value: '2',
      text: 'Recent mock orders',
      iconClass: 'bi bi-bag-check'
    },
    {
      label: 'Customers',
      value: '2',
      text: 'Registered mock customers',
      iconClass: 'bi bi-people'
    },
    {
      label: 'Reviews',
      value: '2',
      text: 'Product review records',
      iconClass: 'bi bi-star'
    }
  ];

  adminCards = [
    {
      title: 'Storefront Content',
      description: 'Manage homepage content, collection page copy, images, footer content, and public layout text.',
      route: '/admin/storefront-content',
      iconClass: 'bi bi-window-sidebar'
    },
    {
      title: 'Product Catalog',
      description: 'Manage products, categories, variants, stock, product images, and product display status.',
      route: '/admin/product-catalog',
      iconClass: 'bi bi-grid'
    },
    {
      title: 'Orders',
      description: 'View customer orders, payment status, fulfilment status, and delivery progress.',
      route: '/admin/order-management',
      iconClass: 'bi bi-bag-check'
    },
    {
      title: 'Customers',
      description: 'View registered customers, order counts, spend totals, and account status.',
      route: '/admin/customer-management',
      iconClass: 'bi bi-people'
    },
    {
      title: 'Reviews',
      description: 'Moderate product reviews, customer ratings, approval status, and hidden reviews.',
      route: '/admin/review-management',
      iconClass: 'bi bi-star'
    },
    {
      title: 'Newsletter',
      description: 'Manage newsletter subscribers, sign-up records, and active subscriber status.',
      route: '/admin/newsletter-management',
      iconClass: 'bi bi-envelope'
    },
    {
      title: 'Settings',
      description: 'Manage support email, delivery fee, free delivery threshold, business hours, and store rules.',
      route: '/admin/settings',
      iconClass: 'bi bi-gear'
    }
  ];
}