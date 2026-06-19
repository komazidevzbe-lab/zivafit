import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminCustomer } from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

@Component({
  selector: 'app-admin-customer-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-customer-management.component.html',
  styleUrl: './admin-customer-management.component.css'
})
export class AdminCustomerManagementComponent {
  private adminManagementService = inject(AdminManagementService);

  get customers(): AdminCustomer[] {
    return this.adminManagementService.customers();
  }

  get activeCustomers(): number {
    return this.customers.filter(customer => customer.isActive).length;
  }

  get totalSpend(): number {
    return this.customers.reduce((total, customer) => total + customer.totalSpend, 0);
  }

  trackByCustomerId(index: number, customer: AdminCustomer): number {
    return customer.id;
  }
}