import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  CustomerAddress,
  CustomerPaymentMethod
} from '../../_models/customer-account';
import { CartLine } from '../../_models/shopping-state';
import { AccountService } from '../../_services/account.service';
import { CustomerAddressService } from '../../_services/customer-address.service';
import { CustomerOrderService } from '../../_services/customer-order.service';
import { ShopStateService } from '../../_services/shop-state.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);

  shopStateService = inject(ShopStateService);
  customerAddressService = inject(CustomerAddressService);
  customerOrderService = inject(CustomerOrderService);

  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];

  paymentMethods: { value: CustomerPaymentMethod; label: string; text: string }[] = [
    {
      value: 'PayFast',
      label: 'PayFast',
      text: 'Local secure payment flow for South African checkout.'
    },
    {
      value: 'Card',
      label: 'Card',
      text: 'Use a debit or credit card when payment gateway is connected.'
    },
    {
      value: 'EFT',
      label: 'EFT',
      text: 'Manual payment option for later backend payment handling.'
    }
  ];

  checkoutAddress: CustomerAddress = this.createEmptyAddress();
  contactEmail = '';
  paymentMethod: CustomerPaymentMethod = 'PayFast';
  orderNote = '';
  saveAddress = true;
  selectedAddressId: number | null = null;

  formError = '';

  ngOnInit(): void {
    this.prefillCustomerDetails();
  }

  get hasCartItems(): boolean {
    return this.shopStateService.cartLines().length > 0;
  }

  selectSavedAddress(address: CustomerAddress): void {
    this.selectedAddressId = address.id;
    this.checkoutAddress = { ...address };
    this.formError = '';
  }

  placeOrder(): void {
    this.formError = '';

    if (!this.hasCartItems) {
      this.formError = 'Your cart is empty. Add products before placing an order.';
      return;
    }

    if (!this.isCheckoutValid()) {
      this.formError = 'Please complete your contact and delivery details before placing the order.';
      return;
    }

    if (this.saveAddress) {
      if (this.selectedAddressId) {
        this.customerAddressService.updateAddress({
          ...this.checkoutAddress,
          id: this.selectedAddressId
        });
      } else {
        const savedAddress = this.customerAddressService.addAddress({
          ...this.checkoutAddress,
          id: 0
        });

        this.checkoutAddress = { ...savedAddress };
      }
    }

    this.customerOrderService.createOrder(
      this.shopStateService.cartLines(),
      this.checkoutAddress,
      this.contactEmail.trim(),
      this.checkoutAddress.phone.trim(),
      this.paymentMethod,
      this.orderNote.trim()
    );

    this.shopStateService.clearCart();
    this.router.navigateByUrl('/order-confirmation');
  }

  trackByAddressId(index: number, address: CustomerAddress): number {
    return address.id;
  }

  trackByCartLine(index: number, line: CartLine): string {
    return `${line.product.id}-${line.size}`;
  }

  private prefillCustomerDetails(): void {
    const user = this.accountService.currentUser();
    const defaultAddress = this.customerAddressService.getDefaultAddress();

    this.contactEmail = user?.email || '';

    if (defaultAddress) {
      this.selectedAddressId = defaultAddress.id;
      this.checkoutAddress = { ...defaultAddress };
      return;
    }

    this.checkoutAddress = {
      ...this.checkoutAddress,
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : ''
    };
  }

  private isCheckoutValid(): boolean {
    return !!(
      this.contactEmail.trim() &&
      this.checkoutAddress.fullName.trim() &&
      this.checkoutAddress.phone.trim() &&
      this.checkoutAddress.addressLine1.trim() &&
      this.checkoutAddress.city.trim() &&
      this.checkoutAddress.province.trim() &&
      this.checkoutAddress.postalCode.trim()
    );
  }

  private createEmptyAddress(): CustomerAddress {
    return {
      id: 0,
      label: 'Home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      suburb: '',
      city: '',
      province: 'Gauteng',
      postalCode: '',
      isDefault: true
    };
  }
}