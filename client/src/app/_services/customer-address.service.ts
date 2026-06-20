import { Injectable, signal } from '@angular/core';

import { CustomerAddress } from '../_models/customer-account';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private readonly addressStorageKey = 'zivafit-customer-addresses';

  addresses = signal<CustomerAddress[]>(this.loadAddresses());

  getDefaultAddress(): CustomerAddress | null {
    return this.addresses().find(address => address.isDefault) || this.addresses()[0] || null;
  }

  addAddress(address: CustomerAddress): CustomerAddress {
    const nextAddress: CustomerAddress = {
      ...address,
      id: this.getNextId(),
      isDefault: this.addresses().length === 0 || address.isDefault
    };

    const existingAddresses = nextAddress.isDefault
      ? this.addresses().map(item => ({ ...item, isDefault: false }))
      : this.addresses();

    this.addresses.set([...existingAddresses, nextAddress]);
    this.saveAddresses();

    return nextAddress;
  }

  updateAddress(address: CustomerAddress): void {
    const updatedAddresses = this.addresses().map(item => {
      if (address.isDefault && item.id !== address.id)
        return { ...item, isDefault: false };

      if (item.id === address.id)
        return { ...address };

      return item;
    });

    this.addresses.set(updatedAddresses);
    this.ensureOneDefaultAddress();
    this.saveAddresses();
  }

  deleteAddress(addressId: number): void {
    this.addresses.set(this.addresses().filter(address => address.id !== addressId));
    this.ensureOneDefaultAddress();
    this.saveAddresses();
  }

  setDefaultAddress(addressId: number): void {
    this.addresses.set(
      this.addresses().map(address => ({
        ...address,
        isDefault: address.id === addressId
      }))
    );

    this.saveAddresses();
  }

  private ensureOneDefaultAddress(): void {
    const currentAddresses = this.addresses();

    if (currentAddresses.length === 0)
      return;

    if (currentAddresses.some(address => address.isDefault))
      return;

    this.addresses.set(
      currentAddresses.map((address, index) => ({
        ...address,
        isDefault: index === 0
      }))
    );
  }

  private getNextId(): number {
    if (this.addresses().length === 0)
      return 1;

    return Math.max(...this.addresses().map(address => address.id)) + 1;
  }

  private loadAddresses(): CustomerAddress[] {
    try {
      const storedAddresses = localStorage.getItem(this.addressStorageKey);

      if (!storedAddresses)
        return [];

      return JSON.parse(storedAddresses) as CustomerAddress[];
    } catch {
      return [];
    }
  }

  private saveAddresses(): void {
    localStorage.setItem(this.addressStorageKey, JSON.stringify(this.addresses()));
  }
}