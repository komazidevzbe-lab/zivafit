import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'accessories',
    mode: 'category',
    category: 'Accessories',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Accessories',
    heroTitle: 'Carry Every Session.',
    heroText: 'Gym bags, totes, travel bags, and everyday carry pieces designed to support your active lifestyle.',
    heroButtonLabel: 'Shop Accessories',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Gym-ready storage' },
      { iconClass: 'bi bi-check2-circle', label: 'Everyday carry' },
      { iconClass: 'bi bi-check2-circle', label: 'Premium neutral styling' }
    ],
    heroImages: [
      { imageUrl: 'assets/gymbag1.png', imageAlt: 'ZivaFit cocoa gym bag' },
      { imageUrl: 'assets/gymbag5.png', imageAlt: 'ZivaFit black everyday gym bag' },
      { imageUrl: 'assets/gymbag3.png', imageAlt: 'ZivaFit travel gym bag' }
    ],

    benefits: [
      { iconClass: 'bi bi-bag-heart', title: 'Carry all essentials', text: 'Space for gym, work, and everyday movement needs.' },
      { iconClass: 'bi bi-stars', title: 'Clean styling', text: 'Neutral accessories that pair with the full ZivaFit range.' },
      { iconClass: 'bi bi-truck', title: 'Nationwide delivery', text: 'Prepared for delivery across South Africa.' }
    ],

    collectionEyebrow: 'Shop carry pieces',
    collectionTitle: 'Accessories',

    emptyTitle: 'No accessories found',
    emptyText: 'Try another filter to view more ZivaFit accessories.',

    noteEyebrow: 'Accessory note',
    noteTitle: 'The full outfit includes what you carry too.',
    noteText: 'ZivaFit accessories are planned to support gym sessions, travel, and everyday wellness routines. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}