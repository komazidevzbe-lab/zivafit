import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.css'
})
export class SetsComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'sets',
    mode: 'category',
    category: 'Sets',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Sets',
    heroTitle: 'Matching Sets Made Simple.',
    heroText: 'Coordinated activewear sets for gym sessions, everyday errands, and confident full-look styling.',
    heroButtonLabel: 'Shop Sets',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Complete looks' },
      { iconClass: 'bi bi-check2-circle', label: 'Premium matching colours' },
      { iconClass: 'bi bi-check2-circle', label: 'Easy outfit building' }
    ],
    heroImages: [
      { imageUrl: 'assets/sets1.png', imageAlt: 'ZivaFit cream matching activewear set' },
      { imageUrl: 'assets/sets5.png', imageAlt: 'ZivaFit cocoa studio matching set' },
      { imageUrl: 'assets/sets3.png', imageAlt: 'ZivaFit olive matching activewear set' }
    ],

    benefits: [
      { iconClass: 'bi bi-grid', title: 'Complete outfit', text: 'Matching tops and bottoms for a polished activewear look.' },
      { iconClass: 'bi bi-stars', title: 'Premium styling', text: 'Warm neutral colours and flattering cuts.' },
      { iconClass: 'bi bi-heart', title: 'Confidence first', text: 'Designed to help you feel pulled together with less effort.' }
    ],

    collectionEyebrow: 'Shop complete looks',
    collectionTitle: 'Sets',

    emptyTitle: 'No sets found',
    emptyText: 'Try another filter to view more ZivaFit sets.',

    noteEyebrow: 'Set note',
    noteTitle: 'Full looks without overthinking the outfit.',
    noteText: 'ZivaFit sets are planned as matching activewear looks with coordinated colours, tops, and bottoms. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}