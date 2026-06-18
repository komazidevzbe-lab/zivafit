import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-leggings',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './leggings.component.html',
  styleUrl: './leggings.component.css'
})
export class LeggingsComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'leggings',
    mode: 'category',
    category: 'Leggings',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Leggings',
    heroTitle: 'Leggings Made To Move.',
    heroText: 'High-waist, pocket, seamless, and bootleg leggings designed for comfort, confidence, and everyday movement.',
    heroButtonLabel: 'Shop Leggings',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Squat-proof support' },
      { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' },
      { iconClass: 'bi bi-check2-circle', label: 'Delivery in South Africa' }
    ],
    heroImages: [
      { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit black sculpt leggings' },
      { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit cocoa pocket leggings' },
      { imageUrl: 'assets/bootlegleggings1.png', imageAlt: 'ZivaFit black bootleg leggings' }
    ],

    benefits: [
      { iconClass: 'bi bi-shield-check', title: 'Supportive fits', text: 'Made to hold, smooth, and move with you.' },
      { iconClass: 'bi bi-droplet-half', title: 'Sweat-wicking comfort', text: 'Designed for gym sessions and everyday wear.' },
      { iconClass: 'bi bi-stars', title: 'Premium everyday style', text: 'Warm neutrals, bold basics, and flattering cuts.' }
    ],

    collectionEyebrow: 'Shop the collection',
    collectionTitle: 'Leggings',

    emptyTitle: 'No leggings found',
    emptyText: 'Try another filter to view more ZivaFit leggings.',

    noteEyebrow: 'Fit note',
    noteTitle: 'Leggings should feel secure, smooth, and easy to move in.',
    noteText: 'ZivaFit leggings are planned around different movement styles, including high-waist, pocket, seamless, and bootleg fits. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}