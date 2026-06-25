import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CreateOrder } from '../../_models/order';
import { AccountService } from '../../_services/account.service';
import { CartService } from '../../_services/cart.service';
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
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  cart = this.cartService.currentCart;

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
  // Loads cart and fills customer details from logged-in user.
  // ===============================
  ngOnInit(): void {
    const user = this.accountService.currentUser();

    if (user) {
      this.model.firstName = user.firstName;
      this.model.lastName = user.lastName;
      this.model.email = user.email;
    }

    this.loadCart();
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
}