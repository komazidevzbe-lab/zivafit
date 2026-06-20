import { Injectable, computed, signal } from '@angular/core';

import {
  CustomerAddress,
  CustomerOrder,
  CustomerOrderLine,
  CustomerPaymentMethod
} from '../_models/customer-account';
import { CartLine } from '../_models/shopping-state';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {
  private readonly orderStorageKey = 'zivafit-customer-orders';
  private readonly lastOrderStorageKey = 'zivafit-last-order-number';

  orders = signal<CustomerOrder[]>(this.loadOrders());

  lastOrder = computed(() => {
    const lastOrderNumber = this.getLastOrderNumber();

    if (!lastOrderNumber)
      return this.orders()[0] || null;

    return this.getOrderByNumber(lastOrderNumber) || this.orders()[0] || null;
  });

  getOrderByNumber(orderNumber: string | null): CustomerOrder | undefined {
    if (!orderNumber)
      return undefined;

    return this.orders().find(order => order.orderNumber === orderNumber);
  }

  createOrder(
    cartLines: CartLine[],
    deliveryAddress: CustomerAddress,
    contactEmail: string,
    contactPhone: string,
    paymentMethod: CustomerPaymentMethod,
    orderNote = ''
  ): CustomerOrder {
    const nextId = this.getNextId();
    const subtotal = cartLines.reduce((total, line) => total + line.lineTotal, 0);
    const deliveryFee = subtotal >= 1000 ? 0 : 99;
    const total = subtotal + deliveryFee;

    const order: CustomerOrder = {
      id: nextId,
      orderNumber: this.createOrderNumber(nextId),
      orderDate: new Date().toISOString(),
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentMethod,
      contactEmail,
      contactPhone,
      deliveryAddress: { ...deliveryAddress },
      subtotal,
      subtotalText: this.formatPrice(subtotal),
      deliveryFee,
      deliveryFeeText: deliveryFee === 0 ? 'Free' : this.formatPrice(deliveryFee),
      total,
      totalText: this.formatPrice(total),
      orderNote,
      lines: this.mapCartLines(cartLines)
    };

    this.orders.set([order, ...this.orders()]);
    this.saveOrders();
    localStorage.setItem(this.lastOrderStorageKey, order.orderNumber);

    return order;
  }

  private mapCartLines(cartLines: CartLine[]): CustomerOrderLine[] {
    return cartLines.map(line => ({
      productId: line.product.id,
      name: line.product.name,
      category: line.product.category,
      fitType: line.product.fitType,
      colour: line.product.colour,
      size: line.size,
      quantity: line.quantity,
      price: line.product.price,
      priceText: line.product.priceText,
      lineTotal: line.lineTotal,
      lineTotalText: line.lineTotalText,
      imageUrl: line.product.imageUrl,
      imageAlt: line.product.imageAlt
    }));
  }

  private createOrderNumber(orderId: number): string {
    return `ZVF-${String(1000 + orderId).padStart(4, '0')}`;
  }

  private getNextId(): number {
    if (this.orders().length === 0)
      return 1;

    return Math.max(...this.orders().map(order => order.id)) + 1;
  }

  private getLastOrderNumber(): string | null {
    return localStorage.getItem(this.lastOrderStorageKey);
  }

  private loadOrders(): CustomerOrder[] {
    try {
      const storedOrders = localStorage.getItem(this.orderStorageKey);

      if (!storedOrders)
        return [];

      return JSON.parse(storedOrders) as CustomerOrder[];
    } catch {
      return [];
    }
  }

  private saveOrders(): void {
    localStorage.setItem(this.orderStorageKey, JSON.stringify(this.orders()));
  }

  private formatPrice(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', {
      maximumFractionDigits: 0
    }).replace(/,/g, ' ')}`;
  }
}