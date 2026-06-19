import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AdminProduct,
  AdminProductCategory,
  AdminProductVariant
} from '../../_models/admin-management';
import { ProductCategory } from '../../_models/product-catalog';
import { AdminManagementService } from '../../_services/admin-management.service';

type ProductCatalogTab = 'products' | 'categories' | 'variants' | 'images';

interface CatalogTabCard {
  key: ProductCatalogTab;
  title: string;
  text: string;
  iconClass: string;
}

@Component({
  selector: 'app-admin-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-catalog.component.html',
  styleUrl: './admin-product-catalog.component.css'
})
export class AdminProductCatalogComponent implements OnInit {
  private adminManagementService = inject(AdminManagementService);

  activeTab: ProductCatalogTab = 'products';

  products: AdminProduct[] = [];
  categories: AdminProductCategory[] = [];
  variants: AdminProductVariant[] = [];

  selectedProduct: AdminProduct | null = null;
  isCreatingProduct = false;
  successMessage = '';

  tabCards: CatalogTabCard[] = [
    {
      key: 'products',
      title: 'Products',
      text: 'Product details and display status',
      iconClass: 'bi bi-tag'
    },
    {
      key: 'categories',
      title: 'Categories',
      text: 'Store categories and visibility',
      iconClass: 'bi bi-grid'
    },
    {
      key: 'variants',
      title: 'Variants & Stock',
      text: 'Sizes, colours, stock, and SKU',
      iconClass: 'bi bi-box-seam'
    },
    {
      key: 'images',
      title: 'Product Images',
      text: 'Main product images and alt text',
      iconClass: 'bi bi-image'
    }
  ];

  categoryOptions: ProductCategory[] = [
    'Leggings',
    'Sports Bras',
    'Tops',
    'Sets',
    'Shorts',
    'Accessories'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  selectTab(tab: ProductCatalogTab): void {
    this.activeTab = tab;
    this.successMessage = '';
  }

  selectProduct(productId: number): void {
    const product = this.products.find(item => item.id === Number(productId));

    if (!product)
      return;

    this.selectedProduct = structuredClone(product);
    this.isCreatingProduct = false;
    this.successMessage = '';
  }

  createProduct(): void {
    this.selectedProduct = {
      id: 0,
      name: '',
      category: 'Leggings',
      fitType: '',
      description: '',
      price: 0,
      colour: '',
      badge: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageUrl: '',
      imageAlt: '',
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      isActive: true,
      displayOrder: this.products.length + 1,
      images: []
    };

    this.isCreatingProduct = true;
    this.successMessage = '';
  }

  saveProduct(): void {
    if (!this.selectedProduct)
      return;

    if (this.isCreatingProduct) {
      this.adminManagementService.addProduct(this.selectedProduct);
      this.successMessage = 'Product has been added to mock admin data.';
    } else {
      this.adminManagementService.updateProduct(this.selectedProduct);
      this.successMessage = 'Product has been updated in mock admin data.';
    }

    this.loadData();
    this.selectedProduct = this.products.length > 0 ? structuredClone(this.products[0]) : null;
    this.isCreatingProduct = false;
  }

  deleteProduct(productId: number): void {
    this.adminManagementService.deleteProduct(productId);

    this.loadData();
    this.selectedProduct = this.products.length > 0 ? structuredClone(this.products[0]) : null;
    this.isCreatingProduct = false;
    this.successMessage = 'Product has been deleted from mock admin data.';
  }

  getProductName(productId: number): string {
    return this.products.find(product => product.id === productId)?.name || 'Unknown product';
  }

  trackByProductId(index: number, product: AdminProduct): number {
    return product.id;
  }

  trackByCategoryId(index: number, category: AdminProductCategory): number {
    return category.id;
  }

  trackByVariantId(index: number, variant: AdminProductVariant): number {
    return variant.id;
  }

  trackByTabKey(index: number, item: CatalogTabCard): ProductCatalogTab {
    return item.key;
  }

  private loadData(): void {
    this.products = structuredClone(this.adminManagementService.products());
    this.categories = structuredClone(this.adminManagementService.productCategories());
    this.variants = structuredClone(this.adminManagementService.variants());

    if (!this.selectedProduct && this.products.length > 0) {
      this.selectedProduct = structuredClone(this.products[0]);
    }
  }
}