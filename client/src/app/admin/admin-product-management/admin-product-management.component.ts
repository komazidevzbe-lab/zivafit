import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ProductManagementTab = 'products' | 'categories' | 'stockVariants';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product-management.component.html',
  styleUrl: './admin-product-management.component.css'
})
export class AdminProductManagementComponent {
  activeTab: ProductManagementTab = 'products';

  // ===============================
  // Tab selection
  // Shows the selected Product Management section.
  // ===============================
  selectTab(tab: ProductManagementTab) {
    this.activeTab = tab;
  }
}