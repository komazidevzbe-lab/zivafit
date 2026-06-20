import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';

interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  private accountService = inject(AccountService);

  model: EditProfileForm = {
    firstName: '',
    lastName: '',
    email: ''
  };

  successMessage = '';
  generalError = '';

  ngOnInit(): void {
    const user = this.accountService.currentUser();

    if (!user)
      return;

    this.model = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  }

  saveProfile(): void {
    this.successMessage = '';
    this.generalError = '';

    if (!this.model.firstName.trim() || !this.model.lastName.trim() || !this.model.email.trim()) {
      this.generalError = 'Please complete your first name, last name, and email address.';
      return;
    }

    const user = this.accountService.currentUser();

    if (!user) {
      this.generalError = 'You must be logged in to update your profile.';
      return;
    }

    this.accountService.setCurrentUser({
      ...user,
      firstName: this.model.firstName.trim(),
      lastName: this.model.lastName.trim(),
      email: this.model.email.trim()
    });

    this.successMessage = 'Your profile details have been updated for this session.';
  }
}