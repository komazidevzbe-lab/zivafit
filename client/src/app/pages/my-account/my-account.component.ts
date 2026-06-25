import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerAddress } from '../../_models/customer-account';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { CustomerAddressService } from '../../_services/customer-address.service';

interface AccountProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  private accountService = inject(AccountService);
  customerAddressService = inject(CustomerAddressService);

  private readonly profileStorageKey = 'zivafit-customer-profile';

  currentUser = this.accountService.currentUser;

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

  profileModel: AccountProfileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  };

  addressModel: CustomerAddress = this.createEmptyAddress();

  editingAddressId: number | null = null;

  profileSuccessMessage = '';
  profileErrorMessage = '';

  addressSuccessMessage = '';
  addressErrorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
    this.addressModel = this.createEmptyAddress();
  }

  get fullName(): string {
    const firstName = this.profileModel.firstName.trim();
    const lastName = this.profileModel.lastName.trim();

    return `${firstName} ${lastName}`.trim() || 'Customer';
  }

  get initials(): string {
    const firstInitial = this.profileModel.firstName.trim().charAt(0);
    const lastInitial = this.profileModel.lastName.trim().charAt(0);
    const fallbackInitial = this.profileModel.email.trim().charAt(0);

    return `${firstInitial}${lastInitial}`.trim().toUpperCase() || fallbackInitial.toUpperCase() || 'Z';
  }

  saveProfile(): void {
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';

    if (!this.isValidProfile()) {
      this.profileErrorMessage = 'Please complete your first name, last name, and email address.';
      return;
    }

    const cleanProfile: AccountProfileForm = {
      firstName: this.profileModel.firstName.trim(),
      lastName: this.profileModel.lastName.trim(),
      email: this.profileModel.email.trim().toLowerCase(),
      phoneNumber: this.profileModel.phoneNumber.trim()
    };

    this.profileModel = cleanProfile;
    localStorage.setItem(this.profileStorageKey, JSON.stringify(cleanProfile));

    const user = this.currentUser();

    if (user) {
      const updatedUser: User = {
        ...user,
        firstName: cleanProfile.firstName,
        lastName: cleanProfile.lastName,
        email: cleanProfile.email
      };

      this.accountService.setCurrentUser(updatedUser);
    }

    this.profileSuccessMessage = 'Profile details saved.';
    this.addressModel.fullName = this.fullName;

    if (!this.addressModel.phone) {
      this.addressModel.phone = this.profileModel.phoneNumber;
    }
  }

  resetProfile(): void {
    this.loadProfile();
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';
  }

  saveAddress(): void {
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';

    if (!this.isValidAddress()) {
      this.addressErrorMessage = 'Please complete the recipient name, phone number, street address, city, province, and postal code.';
      return;
    }

    const addressToSave: CustomerAddress = {
      ...this.addressModel,
      label: this.addressModel.label.trim(),
      fullName: this.addressModel.fullName.trim(),
      phone: this.addressModel.phone.trim(),
      addressLine1: this.addressModel.addressLine1.trim(),
      addressLine2: this.addressModel.addressLine2.trim(),
      suburb: this.addressModel.suburb.trim(),
      city: this.addressModel.city.trim(),
      province: this.addressModel.province.trim(),
      postalCode: this.addressModel.postalCode.trim()
    };

    if (this.editingAddressId) {
      this.customerAddressService.updateAddress({
        ...addressToSave,
        id: this.editingAddressId
      });

      this.addressSuccessMessage = 'Delivery address updated.';
    } else {
      this.customerAddressService.addAddress(addressToSave);
      this.addressSuccessMessage = 'Delivery address saved.';
    }

    this.resetAddressForm();
  }

  editAddress(address: CustomerAddress): void {
    this.editingAddressId = address.id;
    this.addressModel = { ...address };
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';
  }

  deleteAddress(addressId: number): void {
    this.customerAddressService.deleteAddress(addressId);

    if (this.editingAddressId === addressId) {
      this.resetAddressForm();
    }

    this.addressSuccessMessage = 'Delivery address removed.';
  }

  setDefaultAddress(addressId: number): void {
    this.customerAddressService.setDefaultAddress(addressId);
    this.addressSuccessMessage = 'Default delivery address updated.';
  }

  resetAddressForm(): void {
    this.editingAddressId = null;
    this.addressModel = this.createEmptyAddress();
  }

  trackByAddressId(index: number, address: CustomerAddress): number {
    return address.id;
  }

  private loadProfile(): void {
    const user = this.currentUser();
    const storedProfile = this.getStoredProfile();

    this.profileModel = {
      firstName: storedProfile?.firstName || user?.firstName || '',
      lastName: storedProfile?.lastName || user?.lastName || '',
      email: storedProfile?.email || user?.email || '',
      phoneNumber: storedProfile?.phoneNumber || ''
    };
  }

  private getStoredProfile(): AccountProfileForm | null {
    try {
      const storedProfile = localStorage.getItem(this.profileStorageKey);

      if (!storedProfile) {
        return null;
      }

      return JSON.parse(storedProfile) as AccountProfileForm;
    } catch {
      return null;
    }
  }

  private isValidProfile(): boolean {
    return !!(
      this.profileModel.firstName.trim() &&
      this.profileModel.lastName.trim() &&
      this.profileModel.email.trim()
    );
  }

  private isValidAddress(): boolean {
    return !!(
      this.addressModel.fullName.trim() &&
      this.addressModel.phone.trim() &&
      this.addressModel.addressLine1.trim() &&
      this.addressModel.city.trim() &&
      this.addressModel.province.trim() &&
      this.addressModel.postalCode.trim()
    );
  }

  private createEmptyAddress(): CustomerAddress {
    return {
      id: 0,
      label: '',
      fullName: this.fullName === 'Customer' ? '' : this.fullName,
      phone: this.profileModel.phoneNumber || '',
      addressLine1: '',
      addressLine2: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: this.customerAddressService.addresses().length === 0
    };
  }
}