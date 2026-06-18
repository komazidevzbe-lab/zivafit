import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'shop',
    mode: 'all',
    filterType: 'category',

    heroEyebrow: 'ZivaFit Shop',
    heroTitle: 'Activewear For Every Move.',
    heroText: 'Browse the full ZivaFit range, from supportive staples to complete activewear looks.',
    heroButtonLabel: 'Shop Products',
    secondaryButtonLabel: 'View New In',
    secondaryButtonRoute: '/new-in',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Premium everyday fit' },
      { iconClass: 'bi bi-check2-circle', label: 'Warm neutral colours' },
      { iconClass: 'bi bi-check2-circle', label: 'South African store' }
    ],
    heroImages: [
      { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit leggings product preview' },
      { imageUrl: 'assets/sets5.png', imageAlt: 'ZivaFit matching set product preview' },
      { imageUrl: 'assets/gymbag5.png', imageAlt: 'ZivaFit gym bag product preview' }
    ],

    benefits: [
      { iconClass: 'bi bi-grid', title: 'Full catalogue', text: 'Leggings, sports bras, tops, sets, shorts, and accessories.' },
      { iconClass: 'bi bi-heart', title: 'Designed for confidence', text: 'Clean, premium pieces for different movement styles.' },
      { iconClass: 'bi bi-shield-check', title: 'Built for comfort', text: 'Supportive fits for training, errands, and everyday wear.' }
    ],

    collectionEyebrow: 'Browse all',
    collectionTitle: 'Shop',

    emptyTitle: 'No products found',
    emptyText: 'Try another filter to view more ZivaFit products.',

    noteEyebrow: 'Shop note',
    noteTitle: 'One catalogue structure for the full store.',
    noteText: 'This Shop page uses reusable frontend catalogue data for now. In the backend product phase, this page should fetch real products, categories, variants, stock, and images from the database.'
  };
}