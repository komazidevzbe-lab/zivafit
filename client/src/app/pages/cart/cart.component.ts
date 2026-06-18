import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartLine } from '../../_models/shopping-state';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  shopStateService = inject(ShopStateService);

  increaseQuantity(line: CartLine): void {
    this.shopStateService.increaseCartQuantity(line.product.id, line.size);
  }

  decreaseQuantity(line: CartLine): void {
    this.shopStateService.decreaseCartQuantity(line.product.id, line.size);
  }

  removeItem(line: CartLine): void {
    this.shopStateService.removeFromCart(line.product.id, line.size);
  }

  clearCart(): void {
    this.shopStateService.clearCart();
  }

  trackByCartLine(index: number, line: CartLine): string {
    return `${line.product.id}-${line.size}`;
  }
}