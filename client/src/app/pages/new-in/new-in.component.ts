import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-new-in',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './new-in.component.html',
  styleUrl: './new-in.component.css'
})
export class NewInComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'new-in',
    mode: 'new',
    filterType: 'category',

    heroEyebrow: 'ZivaFit New In',
    heroTitle: 'Fresh Activewear Just Landed.',
    heroText: 'Discover the latest ZivaFit drops across leggings, sports bras, tops, sets, shorts, and accessories.',
    heroButtonLabel: 'Shop New In',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Latest arrivals' },
      { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' },
      { iconClass: 'bi bi-check2-circle', label: 'Delivery in South Africa' }
    ],
    heroImages: [
      { imageUrl: 'assets/sets1.png', imageAlt: 'ZivaFit new matching activewear set' },
      { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit new pocket leggings' },
      { imageUrl: 'assets/bra1.png', imageAlt: 'ZivaFit new sports bra' }
    ],

    benefits: [
      { iconClass: 'bi bi-stars', title: 'Fresh drops', text: 'New colours, updated fits, and fresh outfit ideas.' },
      { iconClass: 'bi bi-bag-heart', title: 'Full outfits', text: 'Build complete looks from activewear to accessories.' },
      { iconClass: 'bi bi-truck', title: 'Nationwide delivery', text: 'Prepared for shipping across South Africa.' }
    ],

    collectionEyebrow: 'Latest arrivals',
    collectionTitle: 'New In',

    emptyTitle: 'No new arrivals found',
    emptyText: 'Try another filter to view more ZivaFit products.',

    noteEyebrow: 'New in note',
    noteTitle: 'Fresh pieces without changing the ZivaFit feel.',
    noteText: 'This New In page uses temporary frontend product data for now. During the backend product catalogue phase, these items will be loaded from the database and managed from the admin product area.'
  };
}