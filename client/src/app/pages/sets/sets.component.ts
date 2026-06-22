import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.css'
})
export class SetsComponent { }