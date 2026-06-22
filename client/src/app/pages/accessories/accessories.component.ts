import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent { }