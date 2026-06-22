import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-shorts',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './shorts.component.html',
  styleUrl: './shorts.component.css'
})
export class ShortsComponent { }