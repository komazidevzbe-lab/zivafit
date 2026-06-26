import { Injectable, signal } from '@angular/core';

import { CustomerAddress } from '../_models/customer-account';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private readonly addressStorageKey = 'zivafit-customer-addresses';

  addresses = signal<CustomerAddress[]>(this.loadAddresses());

  // ===============================
  // Get default address
  // Returns the default complete saved address, or the first complete saved address.
  // ===============================
  getDefaultAddress(): CustomerAddress | null {
    const completeAddresses = this.addresses().filter(address => this.isCompleteAddress(address));

    return completeAddresses.find(address => address.isDefault) || completeAddresses[0] || null;
  }

  // ===============================
  // Get address by ID
  // Used by checkout when the customer selects a saved delivery address.
  // ===============================
  getAddressById(addressId: number): CustomerAddress | null {
    return this.addresses().find(address => address.id === addressId) || null;
  }

  // ===============================
  // Add address
  // Saves a complete delivery address and keeps only one default address.
  // ===============================
  addAddress(address: CustomerAddress): CustomerAddress {
    const nextAddress: CustomerAddress = {
      ...this.cleanAddress(address),
      id: this.getNextId(),
      isDefault: this.addresses().length === 0 || address.isDefault
    };

    const existingAddresses = nextAddress.isDefault
      ? this.addresses().map(item => ({ ...item, isDefault: false }))
      : this.addresses();

    this.addresses.set([...existingAddresses, nextAddress]);
    this.ensureOneDefaultAddress();
    this.saveAddresses();

    return nextAddress;
  }

  // ===============================
  // Update address
  // Updates a saved address and keeps the default-address state correct.
  // ===============================
  updateAddress(address: CustomerAddress): void {
    const cleanAddress = this.cleanAddress(address);

    const updatedAddresses = this.addresses().map(item => {
      if (cleanAddress.isDefault && item.id !== cleanAddress.id)
        return { ...item, isDefault: false };

      if (item.id === cleanAddress.id)
        return { ...cleanAddress };

      return item;
    });

    this.addresses.set(updatedAddresses);
    this.ensureOneDefaultAddress();
    this.saveAddresses();
  }

  // ===============================
  // Delete address
  // Removes an address and makes sure one saved address remains default.
  // ===============================
  deleteAddress(addressId: number): void {
    this.addresses.set(this.addresses().filter(address => address.id !== addressId));
    this.ensureOneDefaultAddress();
    this.saveAddresses();
  }

  // ===============================
  // Set default address
  // Marks one saved address as the default checkout address.
  // ===============================
  setDefaultAddress(addressId: number): void {
    this.addresses.set(
      this.addresses().map(address => ({
        ...address,
        isDefault: address.id === addressId
      }))
    );

    this.saveAddresses();
  }

  // ===============================
  // Complete address check
  // Required fields: name, number, street address, suburb, city, province, postal code.
  // ===============================
  private isCompleteAddress(address: CustomerAddress): boolean {
    return !!(
      address.fullName.trim() &&
      address.phone.trim() &&
      address.addressLine1.trim() &&
      address.suburb.trim() &&
      address.city.trim() &&
      address.province.trim() &&
      address.postalCode.trim()
    );
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

      if (!storedAddresses) {
        const seededAddresses = this.createSeedAddresses();
        localStorage.setItem(this.addressStorageKey, JSON.stringify(seededAddresses));
        return seededAddresses;
      }

      const parsedAddresses = JSON.parse(storedAddresses);
      const normalisedAddresses = this.normaliseAddresses(parsedAddresses);

      if (normalisedAddresses.length === 0) {
        const seededAddresses = this.createSeedAddresses();
        localStorage.setItem(this.addressStorageKey, JSON.stringify(seededAddresses));
        return seededAddresses;
      }

      localStorage.setItem(this.addressStorageKey, JSON.stringify(normalisedAddresses));

      return normalisedAddresses;
    } catch {
      const seededAddresses = this.createSeedAddresses();
      localStorage.setItem(this.addressStorageKey, JSON.stringify(seededAddresses));
      return seededAddresses;
    }
  }

  private saveAddresses(): void {
    localStorage.setItem(this.addressStorageKey, JSON.stringify(this.addresses()));
  }

  private normaliseAddresses(value: unknown): CustomerAddress[] {
    if (!Array.isArray(value))
      return [];

    const addresses = value
      .map((item, index) => this.normaliseAddress(item, index))
      .filter(address => this.isCompleteAddress(address));

    if (addresses.length === 0)
      return [];

    let defaultAlreadyUsed = false;

    return addresses.map((address, index) => {
      const shouldBeDefault = address.isDefault && !defaultAlreadyUsed;

      if (shouldBeDefault)
        defaultAlreadyUsed = true;

      return {
        ...address,
        isDefault: shouldBeDefault || (!defaultAlreadyUsed && index === 0)
      };
    });
  }

  private normaliseAddress(value: unknown, index: number): CustomerAddress {
    const address = value as Partial<CustomerAddress>;

    const city = this.cleanString(address.city);
    const postalCode = this.cleanString(address.postalCode);

    let province = this.cleanString(address.province);

    if (
      city.toLowerCase() === 'kimberley' &&
      postalCode === '8301' &&
      province.toLowerCase() === 'gauteng'
    ) {
      province = 'Northern Cape';
    }

    return {
      id: this.getSafeId(address.id, index),
      label: this.cleanString(address.label) || 'Home',
      fullName: this.cleanString(address.fullName),
      phone: this.cleanString(address.phone),
      addressLine1: this.cleanString(address.addressLine1),
      addressLine2: this.cleanString(address.addressLine2),
      suburb: this.cleanString(address.suburb),
      city,
      province,
      postalCode,
      isDefault: !!address.isDefault
    };
  }

  private cleanAddress(address: CustomerAddress): CustomerAddress {
    return {
      id: address.id,
      label: this.cleanString(address.label) || 'Home',
      fullName: this.cleanString(address.fullName),
      phone: this.cleanString(address.phone),
      addressLine1: this.cleanString(address.addressLine1),
      addressLine2: this.cleanString(address.addressLine2),
      suburb: this.cleanString(address.suburb),
      city: this.cleanString(address.city),
      province: this.cleanString(address.province),
      postalCode: this.cleanString(address.postalCode),
      isDefault: address.isDefault
    };
  }

  private getSafeId(value: unknown, index: number): number {
    if (typeof value === 'number' && value > 0)
      return value;

    if (typeof value === 'string') {
      const parsedValue = Number(value);

      if (!Number.isNaN(parsedValue) && parsedValue > 0)
        return parsedValue;
    }

    return index + 1;
  }

  private cleanString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private createSeedAddresses(): CustomerAddress[] {
    return [
      {
        id: 1,
        label: 'Home',
        fullName: 'Ziva Customer',
        phone: '0600000000',
        addressLine1: '123 Ziva Street',
        addressLine2: '',
        suburb: 'Central',
        city: 'Kimberley',
        province: 'Northern Cape',
        postalCode: '8301',
        isDefault: true
      }
    ];
  }
}