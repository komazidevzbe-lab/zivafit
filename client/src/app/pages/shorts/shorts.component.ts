import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-shorts',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './shorts.component.html',
  styleUrl: './shorts.component.css'
})
export class ShortsComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'shorts',
    mode: 'category',
    category: 'Shorts',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Shorts',
    heroTitle: 'Shorts Made To Move.',
    heroText: 'Bike shorts, pocket shorts, gym shorts, and skorts designed for comfort, coverage, and confident movement.',
    heroButtonLabel: 'Shop Shorts',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Easy movement' },
      { iconClass: 'bi bi-check2-circle', label: 'Shorts and skorts' },
      { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' }
    ],
    heroImages: [
      { imageUrl: 'assets/short3.png', imageAlt: 'ZivaFit black pocket activewear shorts' },
      { imageUrl: 'assets/skort1.png', imageAlt: 'ZivaFit cream activewear skort' },
      { imageUrl: 'assets/short1.png', imageAlt: 'ZivaFit cream bike shorts' }
    ],

    benefits: [
      { iconClass: 'bi bi-shield-check', title: 'Comfortable coverage', text: 'Designed for movement without feeling restricted.' },
      { iconClass: 'bi bi-stars', title: 'Skort options', text: 'Feminine activewear styling with built-in practicality.' },
      { iconClass: 'bi bi-droplet-half', title: 'Gym-ready feel', text: 'Easy pieces for training, walking, and everyday wear.' }
    ],

    collectionEyebrow: 'Shop warm-weather movement',
    collectionTitle: 'Shorts',

    emptyTitle: 'No shorts found',
    emptyText: 'Try another filter to view more ZivaFit shorts and skorts.',

    noteEyebrow: 'Fit note',
    noteTitle: 'Movement should feel light, covered, and confident.',
    noteText: 'ZivaFit shorts and skorts are planned for different movement styles, lengths, and comfort preferences. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}