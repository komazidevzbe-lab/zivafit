import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminStoreSettings } from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent implements OnInit {
  private adminManagementService = inject(AdminManagementService);

  settings!: AdminStoreSettings;
  successMessage = '';

  ngOnInit(): void {
    this.settings = structuredClone(this.adminManagementService.storeSettings());
  }

  saveSettings(): void {
    this.adminManagementService.updateStoreSettings(this.settings);
    this.successMessage = 'Store settings have been saved in mock admin data.';
  }
}