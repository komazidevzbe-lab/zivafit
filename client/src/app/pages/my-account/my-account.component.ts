import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { CustomerAddressService } from '../../_services/customer-address.service';
import { CustomerOrderService } from '../../_services/customer-order.service';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  accountService = inject(AccountService);
  shopStateService = inject(ShopStateService);
  customerOrderService = inject(CustomerOrderService);
  customerAddressService = inject(CustomerAddressService);

  get fullName(): string {
    const user = this.accountService.currentUser();

    if (!user)
      return 'ZivaFit Customer';

    return `${user.firstName} ${user.lastName}`.trim();
  }

  get initials(): string {
    const user = this.accountService.currentUser();

    if (!user)
      return 'ZF';

    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'ZF';
  }

  get defaultAddressText(): string {
    const address = this.customerAddressService.getDefaultAddress();

    if (!address)
      return 'No default address saved yet.';

    return `${address.addressLine1}, ${address.city}, ${address.province}`;
  }
}