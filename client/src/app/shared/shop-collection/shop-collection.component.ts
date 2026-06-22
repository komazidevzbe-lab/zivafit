import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  ProductCatalogItem,
  ProductCategory,
  ProductSort
} from '../../_models/product-catalog';
import { StorefrontCollectionPage } from '../../_models/storefront-content';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { ShopStateService } from '../../_services/shop-state.service';
import { StorefrontContentService } from '../../_services/storefront-content.service';

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
  private storefrontContentService = inject(StorefrontContentService);

  private contentSubscription?: Subscription;
  private productsSubscription?: Subscription;

  shopStateService = inject(ShopStateService);

  @Input({ required: true }) pageKey = '';

  content: StorefrontCollectionPage | null = null;
  activeFilter = 'All';
  selectedSort: ProductSort = 'featured';

  baseProducts: ProductCatalogItem[] = [];
  isLoading = false;
  isContentLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageKey'] && this.pageKey) {
      this.loadCollectionPage();
    }
  }

  ngOnDestroy(): void {
    this.contentSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
  }

  get sectionId(): string {
    return this.content ? `${this.content.pageKey}-products` : 'collection-products';
  }

  get filterOptions(): FilterOption[] {
    if (!this.content)
      return [{ label: 'All' }];

    const values = this.baseProducts.map(product =>
      this.content?.filterType === 'category' ? product.category : product.fitType
    );

    const uniqueValues = Array.from(new Set(values));

    return [
      { label: 'All' },
      ...uniqueValues.map(label => ({ label }))
    ];
  }

  get filteredProducts(): ProductCatalogItem[] {
    if (!this.content)
      return [];

    const filtered = this.activeFilter === 'All'
      ? [...this.baseProducts]
      : this.baseProducts.filter(product => {
        if (this.content?.filterType === 'category')
          return product.category === (this.activeFilter as ProductCategory);

        return product.fitType === this.activeFilter;
      });

    return this.sortProducts(filtered);
  }

  // ===============================
  // Load collection page
  // Loads page content from the backend using the internal page key.
  // ===============================
  private loadCollectionPage(): void {
    this.isContentLoading = true;
    this.isLoading = true;
    this.activeFilter = 'All';
    this.content = null;
    this.baseProducts = [];

    this.contentSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();

    this.contentSubscription = this.storefrontContentService.loadCollectionPage(this.pageKey).subscribe({
      next: content => {
        this.content = content;
        this.isContentLoading = false;
        this.loadProducts(content);
      },
      error: () => {
        this.content = null;
        this.baseProducts = [];
        this.isContentLoading = false;
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Load products
  // Uses the database-backed product catalogue according to collection content mode.
  // ===============================
  private loadProducts(content: StorefrontCollectionPage): void {
    this.isLoading = true;
    this.activeFilter = 'All';

    const request = content.mode === 'new'
      ? this.productCatalogService.getNewProducts()
      : content.mode === 'category' && content.category
        ? this.productCatalogService.getProductsByCategory(content.category)
        : this.productCatalogService.loadProducts();

    this.productsSubscription = request.subscribe({
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

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value as ProductSort;
  }

  toggleWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  scrollToProducts(): void {
    const element = document.getElementById(this.sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private sortProducts(products: ProductCatalogItem[]): ProductCatalogItem[] {
    if (this.selectedSort === 'priceLow')
      return [...products].sort((a, b) => a.price - b.price);

    if (this.selectedSort === 'priceHigh')
      return [...products].sort((a, b) => b.price - a.price);

    if (this.selectedSort === 'name')
      return [...products].sort((a, b) => a.name.localeCompare(b.name));

    return [...products].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured)
        return Number(b.isFeatured) - Number(a.isFeatured);

      return a.displayOrder - b.displayOrder;
    });
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }

  trackByFilterLabel(index: number, filter: FilterOption): string {
    return filter.label;
  }

  trackByHeroPointId(index: number, point: { id: number }): number {
    return point.id;
  }

  trackByHeroImageId(index: number, image: { id: number }): number {
    return image.id;
  }

  trackByBenefitId(index: number, benefit: { id: number }): number {
    return benefit.id;
  }

  trackBySize(index: number, size: string): string {
    return size;
  }
}