import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  ProductCatalogItem,
  ProductCategory,
  ProductSort,
  ShopCollectionConfig
} from '../../_models/product-catalog';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { ShopStateService } from '../../_services/shop-state.service';

interface FilterOption {
  label: string;
}

@Component({
  selector: 'app-shop-collection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-collection.component.html',
  styleUrl: './shop-collection.component.css'
})
export class ShopCollectionComponent implements OnChanges, OnDestroy {
  private productCatalogService = inject(ProductCatalogService);
  private loadSubscription?: Subscription;

  shopStateService = inject(ShopStateService);

  @Input({ required: true }) config!: ShopCollectionConfig;

  activeFilter = 'All';
  selectedSort: ProductSort = 'featured';
  ratingStars = [1, 2, 3, 4, 5];

  baseProducts: ProductCatalogItem[] = [];
  isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.loadProducts();
    }
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  get sectionId(): string {
    return `${this.config.pageKey}-products`;
  }

  get filterOptions(): FilterOption[] {
    const values = this.baseProducts.map(product =>
      this.config.filterType === 'category' ? product.category : product.fitType
    );

    const uniqueValues = Array.from(new Set(values));

    return [
      { label: 'All' },
      ...uniqueValues.map(label => ({ label }))
    ];
  }

  get filteredProducts(): ProductCatalogItem[] {
    const filtered = this.activeFilter === 'All'
      ? [...this.baseProducts]
      : this.baseProducts.filter(product => {
          if (this.config.filterType === 'category')
            return product.category === (this.activeFilter as ProductCategory);

          return product.fitType === this.activeFilter;
        });

    return this.sortProducts(filtered);
  }

  // ===============================
  // Load products
  // Replaces frontend dummy catalogue data with API data from the database.
  // ===============================
  private loadProducts(): void {
    this.isLoading = true;
    this.activeFilter = 'All';

    this.loadSubscription?.unsubscribe();

    const request = this.config.mode === 'new'
      ? this.productCatalogService.getNewProducts()
      : this.config.mode === 'category' && this.config.category
        ? this.productCatalogService.getProductsByCategory(this.config.category)
        : this.productCatalogService.loadProducts();

    this.loadSubscription = request.subscribe({
      next: products => {
        this.baseProducts = products;
        this.isLoading = false;
      },
      error: () => {
        this.baseProducts = [];
        this.isLoading = false;
      }
    });
  }

  scrollToProducts(): void {
    const productsSection = document.getElementById(this.sectionId);

    if (!productsSection)
      return;

    productsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onSortChange(event: Event): void {
    this.selectedSort = (event.target as HTMLSelectElement).value as ProductSort;
  }

  toggleWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }

  trackByFilterLabel(index: number, filter: FilterOption): string {
    return filter.label;
  }

  trackByHeroImage(index: number, image: { imageUrl: string }): string {
    return image.imageUrl;
  }

  trackByHeroPoint(index: number, point: { label: string }): string {
    return point.label;
  }

  trackByBenefitTitle(index: number, benefit: { title: string }): string {
    return benefit.title;
  }

  trackBySize(index: number, size: string): string {
    return size;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }

  private sortProducts(products: ProductCatalogItem[]): ProductCatalogItem[] {
    switch (this.selectedSort) {
      case 'priceLow':
        return [...products].sort((a, b) => a.price - b.price);

      case 'priceHigh':
        return [...products].sort((a, b) => b.price - a.price);

      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));

      default:
        return [...products].sort((a, b) => {
          if (a.isFeatured !== b.isFeatured)
            return a.isFeatured ? -1 : 1;

          if (a.isBestSeller !== b.isBestSeller)
            return a.isBestSeller ? -1 : 1;

          if (a.isNew !== b.isNew)
            return a.isNew ? -1 : 1;

          return a.displayOrder - b.displayOrder;
        });
    }
  }
}