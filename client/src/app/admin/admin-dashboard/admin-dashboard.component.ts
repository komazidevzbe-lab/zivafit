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
  adminCards = [
    {
      title: 'Home Management',
      description: 'Homepage sections will be managed here later.',
      route: '/admin/home-management'
    },
    {
      title: 'Product Management',
      description: 'Products, categories, and stock variants will be managed here later.',
      route: '/admin/product-management'
    },
    {
      title: 'Order Management',
      description: 'Customer orders and statuses will be managed here later.',
      route: '/admin/order-management'
    },
    {
      title: 'Customer Management',
      description: 'Registered customers will be managed here later.',
      route: '/admin/customer-management'
    },
    {
      title: 'Review Management',
      description: 'Product reviews and moderation tools will be managed here later.',
      route: '/admin/review-management'
    },
    {
      title: 'Newsletter Management',
      description: 'Newsletter subscribers and campaigns will be managed here later.',
      route: '/admin/newsletter-management'
    }
  ];
}