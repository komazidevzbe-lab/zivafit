import { Component } from '@angular/core';

import { ShopCollectionConfig } from '../../_models/product-catalog';
import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-tops',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './tops.component.html',
  styleUrl: './tops.component.css'
})
export class TopsComponent {
  collectionConfig: ShopCollectionConfig = {
    pageKey: 'tops',
    mode: 'category',
    category: 'Tops',
    filterType: 'style',

    heroEyebrow: 'ZivaFit Tops',
    heroTitle: 'Tops Made To Layer.',
    heroText: 'Long sleeves, short sleeves, vests, and studio tops designed to feel polished while staying easy to move in.',
    heroButtonLabel: 'Shop Tops',
    secondaryButtonLabel: 'View All Products',
    secondaryButtonRoute: '/shop',
    heroPoints: [
      { iconClass: 'bi bi-check2-circle', label: 'Layer-friendly' },
      { iconClass: 'bi bi-check2-circle', label: 'Soft stretch fits' },
      { iconClass: 'bi bi-check2-circle', label: 'Warm neutral colours' }
    ],
    heroImages: [
      { imageUrl: 'assets/longsleeveshirt3.png', imageAlt: 'ZivaFit cocoa long sleeve activewear top' },
      { imageUrl: 'assets/longsleeveshirt1.png', imageAlt: 'ZivaFit fitted long sleeve activewear top' },
      { imageUrl: 'assets/shortsleeveshirt1.png', imageAlt: 'ZivaFit short sleeve gym top' }
    ],

    benefits: [
      { iconClass: 'bi bi-layers', title: 'Easy layering', text: 'Wear them over sports bras or under jackets.' },
      { iconClass: 'bi bi-stars', title: 'Polished activewear', text: 'Clean pieces that work in and out of the gym.' },
      { iconClass: 'bi bi-heart', title: 'Comfort-first fit', text: 'Soft, simple silhouettes made for everyday movement.' }
    ],

    collectionEyebrow: 'Shop activewear tops',
    collectionTitle: 'Tops',

    emptyTitle: 'No tops found',
    emptyText: 'Try another filter to view more ZivaFit tops.',

    noteEyebrow: 'Style note',
    noteTitle: 'Made to move, layer, and repeat.',
    noteText: 'ZivaFit tops are planned for training, layering, and everyday outfits. Product data is currently frontend dummy data and will be connected to the real product catalogue during the backend product phase.'
  };
}