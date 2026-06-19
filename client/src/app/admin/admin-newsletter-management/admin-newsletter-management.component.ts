import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminNewsletterSubscriber } from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

@Component({
  selector: 'app-admin-newsletter-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-newsletter-management.component.html',
  styleUrl: './admin-newsletter-management.component.css'
})
export class AdminNewsletterManagementComponent {
  private adminManagementService = inject(AdminManagementService);

  get subscribers(): AdminNewsletterSubscriber[] {
    return this.adminManagementService.newsletterSubscribers();
  }

  get activeSubscribers(): number {
    return this.subscribers.filter(subscriber => subscriber.isActive).length;
  }

  toggleSubscriber(subscriberId: number): void {
    this.adminManagementService.toggleSubscriberStatus(subscriberId);
  }

  trackBySubscriberId(index: number, subscriber: AdminNewsletterSubscriber): number {
    return subscriber.id;
  }
}