import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ProductCatalogCategory, ProductCatalogItem } from '../../_models/product-catalog';
import { StorefrontCollectionPage } from '../../_models/storefront-content';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { StorefrontContentService } from '../../_services/storefront-content.service';

interface AdminSummaryCard {
  label: string;
  value: string;
  text: string;
  iconClass: string;
}

interface AdminAreaCard {
  title: string;
  description: string;
  route: string;
  iconClass: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private productCatalogService = inject(ProductCatalogService);
  private storefrontContentService = inject(StorefrontContentService);

  products: ProductCatalogItem[] = [];
  categories: ProductCatalogCategory[] = [];
  collectionPages: StorefrontCollectionPage[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ===============================
  // Load dashboard data
  // Uses Phase 3 backend data instead of mock catalogue counts.
  // ===============================
  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      products: this.productCatalogService.loadAdminProducts(),
      categories: this.productCatalogService.loadAdminCategories(),
      collectionPages: this.storefrontContentService.loadAdminCollectionPages()
    }).subscribe({
      next: result => {
        this.products = result.products;
        this.categories = result.categories;
        this.collectionPages = result.collectionPages;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.categories = [];
        this.collectionPages = [];
        this.isLoading = false;
      }
    });
  }

  get summaryCards(): AdminSummaryCard[] {
    return [
      {
        label: 'Products',
        value: String(this.products.length),
        text: 'Database catalogue items',
        iconClass: 'bi bi-grid'
      },
      {
        label: 'Active Products',
        value: String(this.products.filter(product => product.isActive).length),
        text: 'Visible in the public catalogue',
        iconClass: 'bi bi-bag-check'
      },
      {
        label: 'Categories',
        value: String(this.categories.length),
        text: 'Seeded database categories',
        iconClass: 'bi bi-tags'
      },
      {
        label: 'Collection Pages',
        value: String(this.collectionPages.length),
        text: 'Database-backed public pages',
        iconClass: 'bi bi-window-sidebar'
      }
    ];
  }

  adminCards: AdminAreaCard[] = [
    {
      title: 'Storefront Content',
      description: 'Manage homepage content, collection page copy, collection images, and public layout text.',
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
      description: 'Order backend management will be connected in the checkout and orders phase.',
      route: '/admin/order-management',
      iconClass: 'bi bi-bag-check'
    },
    {
      title: 'Customers',
      description: 'Customer account management will be connected in the customer account phase.',
      route: '/admin/customer-management',
      iconClass: 'bi bi-people'
    },
    {
      title: 'Reviews',
      description: 'Product review moderation will be connected in the review management phase.',
      route: '/admin/review-management',
      iconClass: 'bi bi-star'
    },
    {
      title: 'Newsletter',
      description: 'Newsletter sign-up records will be connected when the public footer form is implemented.',
      route: '/admin/newsletter-management',
      iconClass: 'bi bi-envelope'
    },
    {
      title: 'Settings',
      description: 'Store settings will be connected when checkout, delivery, and store rules are implemented.',
      route: '/admin/settings',
      iconClass: 'bi bi-gear'
    }
  ];
}