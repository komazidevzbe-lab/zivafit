import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-sports-bras',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './sports-bras.component.html',
  styleUrl: './sports-bras.component.css'
})
export class SportsBrasComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'sports-bras',
    mode: 'category',
    category: 'Sports Bras',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Sports Bras',
    heroTitle: 'Support Made To Move.',
    heroText: 'High-support, medium-support, light-support, and longline sports bras made for comfort, confidence, and movement.',
    heroButtonLabel: 'Shop Sports Bras',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Supportive fits' },
      { iconClass: 'bi bi-check2-circle', label: 'Soft stretch comfort' },
      { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' }
    ],
    heroImages: [
      { imageUrl: 'assets/bra5.png', imageAlt: 'ZivaFit black support sports bra' },
      { imageUrl: 'assets/bra1.png', imageAlt: 'ZivaFit cocoa sports bra' },
      { imageUrl: 'assets/bra3.png', imageAlt: 'ZivaFit olive sports bra' }
    ],

    benefits: [
      { iconClass: 'bi bi-shield-check', title: 'Secure support', text: 'Designed for training, stretching, and everyday movement.' },
      { iconClass: 'bi bi-droplet-half', title: 'Sweat-friendly comfort', text: 'Built for movement without losing the premium feel.' },
      { iconClass: 'bi bi-stars', title: 'Layer-ready style', text: 'Pairs easily with leggings, shorts, and matching sets.' }
    ],

    collectionEyebrow: 'Shop support',
    collectionTitle: 'Sports Bras',

    emptyTitle: 'No sports bras found',
    emptyText: 'Try another filter to view more ZivaFit sports bras.',

    noteEyebrow: 'Fit note',
    noteTitle: 'Support should feel secure, not restrictive.',
    noteText: 'ZivaFit sports bras are planned for different support levels and body types. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}