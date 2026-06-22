import { Component } from '@angular/core';

import { ShopCollectionComponent } from '../../shared/shop-collection/shop-collection.component';

@Component({
  selector: 'app-new-in',
  standalone: true,
  imports: [ShopCollectionComponent],
  templateUrl: './new-in.component.html',
  styleUrl: './new-in.component.css'
})
export class NewInComponent { }