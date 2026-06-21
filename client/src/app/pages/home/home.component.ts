import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { ProductCatalogItem } from '../../_models/product-catalog';
import {
  StorefrontBenefitItem,
  StorefrontCategoryCard,
  StorefrontCategoryCardImage,
  StorefrontHeroCard,
  StorefrontHomeContent
} from '../../_models/storefront-content';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { ShopStateService } from '../../_services/shop-state.service';
import { StorefrontContentService } from '../../_services/storefront-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private productCatalogService = inject(ProductCatalogService);
  private storefrontContentService = inject(StorefrontContentService);
  private homeSubscription?: Subscription;

  shopStateService = inject(ShopStateService);

  private readonly categorySlideDelaySeconds = 7;

  ratingStars = [1, 2, 3, 4, 5];

  homeContent: StorefrontHomeContent | null = null;
  bestSellers: ProductCatalogItem[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.loadHomePage();
  }

  ngOnDestroy(): void {
    this.homeSubscription?.unsubscribe();
  }

  // ===============================
  // Load Home page
  // Loads Home content from the Storefront API and product cards from the Product API.
  // No hero cards, category cards, benefits, or Home copy are hardcoded here.
  // ===============================
  private loadHomePage(): void {
    this.isLoading = true;

    this.homeSubscription = forkJoin({
      content: this.storefrontContentService.loadHomeContent(),
      bestSellers: this.productCatalogService.getBestSellers()
    }).subscribe({
      next: result => {
        this.homeContent = result.content;
        this.bestSellers = result.bestSellers.slice(0, 4);
        this.isLoading = false;
      },
      error: () => {
        this.homeContent = null;
        this.bestSellers = [];
        this.isLoading = false;
      }
    });
  }

  getSlideDelay(index: number): string {
    return `${index * this.categorySlideDelaySeconds}s`;
  }

  toggleWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  trackByHeroCardId(index: number, item: StorefrontHeroCard): number {
    return item.id;
  }

  trackByCategoryCardId(index: number, item: StorefrontCategoryCard): number {
    return item.id;
  }

  trackByCategoryImageId(index: number, item: StorefrontCategoryCardImage): number {
    return item.id;
  }

  trackByBenefitId(index: number, item: StorefrontBenefitItem): number {
    return item.id;
  }

  trackByProductId(index: number, item: ProductCatalogItem): number {
    return item.id;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}