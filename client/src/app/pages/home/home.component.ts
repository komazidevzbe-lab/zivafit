import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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

interface HomeProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  badge: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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

  bestSellers: HomeProduct[] = [
    {
      id: 1,
      name: 'Sculpt High-Waist Legging',
      category: 'Leggings',
      price: 'R899',
      imageUrl: 'assets/leggings3.png',
      imageAlt: 'Sculpt high-waist ZivaFit leggings',
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Power Support Sports Bra',
      category: 'Sports Bras',
      price: 'R699',
      imageUrl: 'assets/bra5.png',
      imageAlt: 'Power support ZivaFit sports bra',
      badge: 'Supportive Fit'
    },
    {
      id: 3,
      name: 'Everyday Long Sleeve Top',
      category: 'Tops',
      price: 'R749',
      imageUrl: 'assets/longsleeveshirt3.png',
      imageAlt: 'Everyday ZivaFit long sleeve activewear top',
      badge: 'New Colour'
    },
    {
      id: 4,
      name: 'Studio Matching Set',
      category: 'Sets',
      price: 'R1 200',
      imageUrl: 'assets/sets5.png',
      imageAlt: 'Studio matching ZivaFit activewear set',
      badge: 'Full Look'
    },
    {
      id: 5,
      name: 'Move Pocket Short',
      category: 'Shorts',
      price: 'R499',
      imageUrl: 'assets/short3.png',
      imageAlt: 'Move pocket ZivaFit activewear shorts',
      badge: 'Easy Movement'
    },
    {
      id: 6,
      name: 'ZivaFit Everyday Gym Bag',
      category: 'Accessories',
      price: 'R849',
      imageUrl: 'assets/gymbag5.png',
      imageAlt: 'ZivaFit everyday gym bag',
      badge: 'Carry All'
    }
  ];

  // ===============================
  // Slideshow delay
  // Staggers category images so each card slowly changes like a soft magazine turn.
  // ===============================
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

  trackByProductId(index: number, item: HomeProduct): number {
    return item.id;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}