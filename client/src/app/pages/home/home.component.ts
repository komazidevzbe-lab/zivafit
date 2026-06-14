import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  bestSellers = [
    { name: 'Product coming soon', price: 'R899' },
    { name: 'Product coming soon', price: 'R749' },
    { name: 'Product coming soon', price: 'R699' },
    { name: 'Product coming soon', price: 'R599' },
    { name: 'Product coming soon', price: 'R849' },
    { name: 'Product coming soon', price: 'R499' }
  ];
}