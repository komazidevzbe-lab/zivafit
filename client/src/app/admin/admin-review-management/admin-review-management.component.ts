import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminReview, AdminReviewStatus } from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

@Component({
  selector: 'app-admin-review-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-review-management.component.html',
  styleUrl: './admin-review-management.component.css'
})
export class AdminReviewManagementComponent {
  private adminManagementService = inject(AdminManagementService);

  get reviews(): AdminReview[] {
    return this.adminManagementService.reviews();
  }

  get pendingReviews(): number {
    return this.reviews.filter(review => review.status === 'Pending').length;
  }

  get approvedReviews(): number {
    return this.reviews.filter(review => review.status === 'Approved').length;
  }

  updateStatus(reviewId: number, status: AdminReviewStatus): void {
    this.adminManagementService.updateReviewStatus(reviewId, status);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, index) => index + 1);
  }

  trackByReviewId(index: number, review: AdminReview): number {
    return review.id;
  }
}