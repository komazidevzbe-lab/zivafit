import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CustomerAddress } from '../../_models/customer-account';
import { CustomerAddressService } from '../../_services/customer-address.service';

@Component({
  selector: 'app-saved-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './saved-addresses.component.html',
  styleUrl: './saved-addresses.component.css'
})
export class SavedAddressesComponent {
  customerAddressService = inject(CustomerAddressService);

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

  editingAddressId: number | null = null;
  successMessage = '';
  errorMessage = '';

  model: CustomerAddress = this.createEmptyAddress();

  saveAddress(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.isValidAddress()) {
      this.errorMessage = 'Please complete the recipient name, phone number, street address, suburb, city, province, and postal code.';
      return;
    }

    if (this.editingAddressId) {
      this.customerAddressService.updateAddress({
        ...this.model,
        id: this.editingAddressId
      });

      this.successMessage = 'Delivery address updated.';
    } else {
      this.customerAddressService.addAddress({ ...this.model });
      this.successMessage = 'Delivery address saved.';
    }

    this.resetForm();
  }

  editAddress(address: CustomerAddress): void {
    this.editingAddressId = address.id;
    this.model = { ...address };
    this.successMessage = '';
    this.errorMessage = '';
  }

  deleteAddress(addressId: number): void {
    this.customerAddressService.deleteAddress(addressId);

    if (this.editingAddressId === addressId)
      this.resetForm();

    this.successMessage = 'Delivery address removed.';
  }

  setDefaultAddress(addressId: number): void {
    this.customerAddressService.setDefaultAddress(addressId);
    this.successMessage = 'Default delivery address updated.';
  }

  resetForm(): void {
    this.editingAddressId = null;
    this.model = this.createEmptyAddress();
  }

  trackByAddressId(index: number, address: CustomerAddress): number {
    return address.id;
  }

  private isValidAddress(): boolean {
    return !!(
      this.model.fullName.trim() &&
      this.model.phone.trim() &&
      this.model.addressLine1.trim() &&
      this.model.suburb.trim() &&
      this.model.city.trim() &&
      this.model.province.trim() &&
      this.model.postalCode.trim()
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
      province: '',
      postalCode: '',
      isDefault: this.customerAddressService?.addresses().length === 0
    };
  }
}