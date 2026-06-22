import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-leggings',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './leggings.component.html',
  styleUrl: './leggings.component.css'
})
export class LeggingsComponent { }