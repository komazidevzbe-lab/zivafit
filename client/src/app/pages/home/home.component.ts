import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCatalogItem } from '../../_models/product-catalog';
import { ProductCatalogService } from '../../_services/product-catalog.service';
import { ShopStateService } from '../../_services/shop-state.service';

interface HomeImage {
  url: string;
  alt: string;
}

interface HomeHeroCard {
  title: string;
  imageUrl: string;
  alt: string;
  cardClass: string;
}

interface HomeCategory {
  title: string;
  route: string;
  images: HomeImage[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private productCatalogService = inject(ProductCatalogService);

  shopStateService = inject(ShopStateService);

  private readonly categorySlideDelaySeconds = 7;

  ratingStars = [1, 2, 3, 4, 5];

  heroCards: HomeHeroCard[] = [
    {
      title: 'ZivaFit Set One',
      imageUrl: 'assets/sets1.png',
      alt: 'Woman wearing a ZivaFit activewear set',
      cardClass: 'card-one'
    },
    {
      title: 'ZivaFit Set Two',
      imageUrl: 'assets/sets2.png',
      alt: 'Woman posing in a matching ZivaFit gym set',
      cardClass: 'card-two'
    },
    {
      title: 'ZivaFit Set Three',
      imageUrl: 'assets/sets3.png',
      alt: 'ZivaFit activewear set styled for gym and movement',
      cardClass: 'card-three'
    },
    {
      title: 'ZivaFit Set Four',
      imageUrl: 'assets/sets4.png',
      alt: 'Woman wearing a premium ZivaFit matching set',
      cardClass: 'card-four'
    }
  ];

  categories: HomeCategory[] = [
    {
      title: 'Leggings',
      route: '/leggings',
      images: [
        { url: 'assets/leggings1.png', alt: 'ZivaFit leggings product preview' },
        { url: 'assets/leggings2.png', alt: 'ZivaFit high-waist leggings product preview' },
        { url: 'assets/bootlegleggings1.png', alt: 'ZivaFit bootleg leggings product preview' },
        { url: 'assets/bootlegleggings2.png', alt: 'ZivaFit bootleg activewear leggings' }
      ]
    },
    {
      title: 'Sports Bras',
      route: '/sports-bras',
      images: [
        { url: 'assets/bra1.png', alt: 'ZivaFit sports bra product preview' },
        { url: 'assets/bra2.png', alt: 'ZivaFit supportive sports bra' },
        { url: 'assets/bra3.png', alt: 'ZivaFit sports bra in activewear styling' },
        { url: 'assets/bra4.png', alt: 'ZivaFit gym sports bra product image' }
      ]
    },
    {
      title: 'Tops',
      route: '/tops',
      images: [
        { url: 'assets/longsleeveshirt1.png', alt: 'ZivaFit long sleeve gym top' },
        { url: 'assets/longsleeveshirt2.png', alt: 'ZivaFit fitted long sleeve activewear top' },
        { url: 'assets/shortsleeveshirt1.png', alt: 'ZivaFit short sleeve activewear top' },
        { url: 'assets/shortsleeveshirt2.png', alt: 'ZivaFit gym top product preview' }
      ]
    },
    {
      title: 'Sets',
      route: '/sets',
      images: [
        { url: 'assets/sets1.png', alt: 'ZivaFit matching activewear set' },
        { url: 'assets/sets2.png', alt: 'ZivaFit coordinated gym set' },
        { url: 'assets/sets3.png', alt: 'ZivaFit premium activewear set' },
        { url: 'assets/sets4.png', alt: 'ZivaFit matching set product preview' }
      ]
    },
    {
      title: 'Shorts',
      route: '/shorts',
      images: [
        { url: 'assets/short1.png', alt: 'ZivaFit activewear shorts' },
        { url: 'assets/short2.png', alt: 'ZivaFit gym shorts product preview' },
        { url: 'assets/skort1.png', alt: 'ZivaFit skort activewear product preview' },
        { url: 'assets/skort2.png', alt: 'ZivaFit skirt shorts product preview' }
      ]
    },
    {
      title: 'Accessories',
      route: '/accessories',
      images: [
        { url: 'assets/gymbag1.png', alt: 'ZivaFit gym bag product preview' },
        { url: 'assets/gymbag2.png', alt: 'ZivaFit activewear accessory bag' },
        { url: 'assets/gymbag3.png', alt: 'ZivaFit gym duffle bag' },
        { url: 'assets/gymbag4.png', alt: 'ZivaFit fitness bag product preview' }
      ]
    }
  ];

  get bestSellers(): ProductCatalogItem[] {
    const activeBestSellers = this.productCatalogService
      .getProducts()
      .filter(product => product.isActive && product.isBestSeller);

    if (activeBestSellers.length > 0)
      return activeBestSellers.slice(0, 8);

    return this.productCatalogService
      .getProducts()
      .filter(product => product.isActive)
      .slice(0, 8);
  }

  toggleWishlist(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.shopStateService.toggleWishlist(productId);
  }

  getSlideDelay(index: number): string {
    return `${index * this.categorySlideDelaySeconds}s`;
  }

  trackByHeroTitle(index: number, item: HomeHeroCard): string {
    return item.title;
  }

  trackByCategoryTitle(index: number, item: HomeCategory): string {
    return item.title;
  }

  trackByImageUrl(index: number, item: HomeImage): string {
    return item.url;
  }

  trackByProductId(index: number, item: ProductCatalogItem): number {
    return item.id;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}