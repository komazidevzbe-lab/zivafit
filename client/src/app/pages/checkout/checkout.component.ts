import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CustomerAddress } from '../../_models/customer-account';
import { CreateOrder } from '../../_models/order';
import { AccountService } from '../../_services/account.service';
import { CartService } from '../../_services/cart.service';
import { CustomerAddressService } from '../../_services/customer-address.service';
import { OrderService } from '../../_services/order.service';
import { PaymentService } from '../../_services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private accountService = inject(AccountService);
  private cartService = inject(CartService);
  private customerAddressService = inject(CustomerAddressService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  cart = this.cartService.currentCart;

  useDefaultAddressChecked = false;
  selectedAddressId: number | null = null;

  model: CreateOrder = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    deliveryMethod: 'Standard Delivery',
    customerNote: ''
  };

  isLoadingCart = false;
  isSubmitting = false;
  errorMessage = '';

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

  // ===============================
  // Page setup
  // Loads cart, fills customer details, and applies the default saved address.
  // ===============================
  ngOnInit(): void {
    const user = this.accountService.currentUser();

    if (user) {
      this.model.firstName = user.firstName;
      this.model.lastName = user.lastName;
      this.model.email = user.email;
    }

    this.prefillDefaultAddress();
    this.loadCart();
  }

  get savedAddresses(): CustomerAddress[] {
    return this.customerAddressService.addresses();
  }

  get defaultAddress(): CustomerAddress | null {
    return this.customerAddressService.getDefaultAddress();
  }

  // ===============================
  // Toggle default address
  // Checked uses the default saved address.
  // Unchecked clears delivery fields so the customer can type manually.
  // ===============================
  toggleDefaultAddress(useDefaultAddress: boolean): void {
    this.useDefaultAddressChecked = useDefaultAddress;

    if (useDefaultAddress) {
      this.applyDefaultAddress();
      return;
    }

    this.selectedAddressId = null;
    this.clearDeliveryAddressFields();
  }

  // ===============================
  // Load cart
  // Checkout requires a backend cart before creating an order.
  // ===============================
  loadCart() {
    this.isLoadingCart = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: cart => {
        this.isLoadingCart = false;

        if (cart.items.length === 0) {
          this.errorMessage = 'Your cart is empty. Add products before checkout.';
        }
      },
      error: error => {
        this.isLoadingCart = false;
        this.errorMessage = error?.error?.message || 'Could not load your cart.';
      }
    });
  }

  // ===============================
  // Place order and pay
  // Creates pending order first, then starts PayFast payment.
  // ===============================
  placeOrderAndPay() {
    this.errorMessage = '';

    if (this.cart().items.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    if (!this.hasRequiredCheckoutDetails()) {
      this.errorMessage =
        'Please complete your name, phone number, street address, suburb, city, province, and postal code.';
      return;
    }

    this.isSubmitting = true;

    this.orderService.createOrder(this.model).subscribe({
      next: order => {
        sessionStorage.setItem('lastOrderId', order.id.toString());

        this.paymentService.initiatePayFastPayment({ orderId: order.id }).subscribe({
          next: payment => {
            this.isSubmitting = false;
            this.cartService.clearLocalCart();
            this.paymentService.submitPayFastForm(payment);
          },
          error: error => {
            this.isSubmitting = false;
            this.errorMessage = error?.error?.message || 'Order created, but PayFast could not be started.';
          }
        });
      },
      error: error => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Could not create your order.';
      }
    });
  }

  // ===============================
  // Back to cart
  // Lets customer adjust cart before checkout.
  // ===============================
  backToCart() {
    this.router.navigateByUrl('/cart');
  }

  private prefillDefaultAddress(): void {
    const address = this.customerAddressService.getDefaultAddress();

    if (!address) {
      this.useDefaultAddressChecked = false;
      return;
    }

    this.useDefaultAddressChecked = true;
    this.selectedAddressId = address.id;
    this.fillModelFromAddress(address);
  }

  private applyDefaultAddress(): void {
    const address = this.customerAddressService.getDefaultAddress();

    if (!address) {
      this.useDefaultAddressChecked = false;
      this.selectedAddressId = null;
      return;
    }

    this.selectedAddressId = address.id;
    this.fillModelFromAddress(address);
  }

  private fillModelFromAddress(address: CustomerAddress): void {
    const splitName = this.splitFullName(address.fullName);

    this.model.firstName = splitName.firstName || this.model.firstName;
    this.model.lastName = splitName.lastName || this.model.lastName;
    this.model.phoneNumber = address.phone;
    this.model.addressLine1 = address.addressLine1;
    this.model.addressLine2 = address.addressLine2;
    this.model.suburb = address.suburb;
    this.model.city = address.city;
    this.model.province = address.province;
    this.model.postalCode = address.postalCode;
  }

  private clearDeliveryAddressFields(): void {
    this.model.phoneNumber = '';
    this.model.addressLine1 = '';
    this.model.addressLine2 = '';
    this.model.suburb = '';
    this.model.city = '';
    this.model.province = '';
    this.model.postalCode = '';
  }

  private splitFullName(fullName: string): { firstName: string; lastName: string } {
    const cleanName = fullName.trim();

    if (!cleanName)
      return { firstName: '', lastName: '' };

    const nameParts = cleanName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    return { firstName, lastName };
  }

  private hasRequiredCheckoutDetails(): boolean {
    return !!(
      this.model.firstName.trim() &&
      this.model.lastName.trim() &&
      this.model.email.trim() &&
      this.model.phoneNumber.trim() &&
      this.model.addressLine1.trim() &&
      this.model.suburb.trim() &&
      this.model.city.trim() &&
      this.model.province.trim() &&
      this.model.postalCode.trim()
    );
  }
}