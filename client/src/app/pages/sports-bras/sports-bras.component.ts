import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-sports-bras',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './sports-bras.component.html',
  styleUrl: './sports-bras.component.css'
})
export class SportsBrasComponent { }