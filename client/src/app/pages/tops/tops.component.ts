import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-tops',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './tops.component.html',
  styleUrl: './tops.component.css'
})
export class TopsComponent { }