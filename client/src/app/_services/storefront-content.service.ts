import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  StorefrontBenefitItem,
  StorefrontCategoryCardImage,
  StorefrontHeroCard,
  StorefrontHomeContent,
  UpdateStorefrontBenefitItemRequest,
  UpdateStorefrontCategoryCardImageRequest,
  UpdateStorefrontHeroCardRequest,
  UpdateStorefrontHomeContentRequest
} from '../_models/storefront-content';

@Injectable({
  providedIn: 'root'
})
export class StorefrontContentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  homeContent = signal<StorefrontHomeContent | null>(null);

  // ===============================
  // Load Home content
  // Loads Home page hero, cards, categories, benefits, and labels from the backend.
  // This prevents Home page content from being hardcoded in Angular.
  // ===============================
  loadHomeContent() {
    return this.http.get<StorefrontHomeContent>(this.baseUrl + 'storefront/home').pipe(
      map(content => this.normaliseHomeContent(content)),
      tap(content => this.homeContent.set(content))
    );
  }

  // ===============================
  // Load admin Home content
  // Admin loads the same database content used by the public Home page.
  // ===============================
  loadAdminHomeContent() {
    return this.http.get<StorefrontHomeContent>(this.baseUrl + 'adminstorefront/home').pipe(
      map(content => this.normaliseHomeContent(content)),
      tap(content => this.homeContent.set(content))
    );
  }

  // ===============================
  // Update admin Home content
  // Updates copy and labels only.
  // Routes remain controlled by Angular routes and backend APIs.
  // ===============================
  updateHomeContent(model: UpdateStorefrontHomeContentRequest) {
    return this.http.put<StorefrontHomeContent>(this.baseUrl + 'adminstorefront/home', model).pipe(
      map(content => this.normaliseHomeContent(content)),
      tap(content => this.homeContent.set(content))
    );
  }

  // ===============================
  // Update hero card
  // Updates title and alt text only.
  // ===============================
  updateHeroCard(heroCardId: number, model: UpdateStorefrontHeroCardRequest) {
    return this.http.put<StorefrontHeroCard>(
      this.baseUrl + `adminstorefront/hero-cards/${heroCardId}`,
      model
    ).pipe(
      map(card => ({
        ...card,
        imageUrl: this.normaliseImageUrl(card.imageUrl)
      })),
      tap(card => this.replaceHeroCard(card))
    );
  }

  // ===============================
  // Upload hero card image
  // Admin uploads a file from their device.
  // ===============================
  uploadHeroCardImage(heroCardId: number, file: File, imageAlt: string) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('imageAlt', imageAlt);

    return this.http.post<StorefrontHeroCard>(
      this.baseUrl + `adminstorefront/hero-cards/${heroCardId}/image/upload`,
      formData
    ).pipe(
      map(card => ({
        ...card,
        imageUrl: this.normaliseImageUrl(card.imageUrl)
      })),
      tap(card => this.replaceHeroCard(card))
    );
  }

  // ===============================
  // Update category image
  // Updates alt text only.
  // ===============================
  updateCategoryCardImage(
    imageId: number,
    model: UpdateStorefrontCategoryCardImageRequest
  ) {
    return this.http.put<StorefrontCategoryCardImage>(
      this.baseUrl + `adminstorefront/category-card-images/${imageId}`,
      model
    ).pipe(
      map(image => ({
        ...image,
        imageUrl: this.normaliseImageUrl(image.imageUrl)
      })),
      tap(image => this.replaceCategoryImage(image))
    );
  }

  // ===============================
  // Upload category image
  // Admin uploads a file from their device.
  // ===============================
  uploadCategoryCardImage(imageId: number, file: File, imageAlt: string) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('imageAlt', imageAlt);

    return this.http.post<StorefrontCategoryCardImage>(
      this.baseUrl + `adminstorefront/category-card-images/${imageId}/image/upload`,
      formData
    ).pipe(
      map(image => ({
        ...image,
        imageUrl: this.normaliseImageUrl(image.imageUrl)
      })),
      tap(image => this.replaceCategoryImage(image))
    );
  }

  // ===============================
  // Update benefit item
  // Updates the Home benefit row.
  // ===============================
  updateBenefitItem(benefitId: number, model: UpdateStorefrontBenefitItemRequest) {
    return this.http.put<StorefrontBenefitItem>(
      this.baseUrl + `adminstorefront/benefits/${benefitId}`,
      model
    ).pipe(
      tap(benefit => this.replaceBenefit(benefit))
    );
  }

  private replaceHeroCard(card: StorefrontHeroCard): void {
    const content = this.homeContent();

    if (!content)
      return;

    this.homeContent.set({
      ...content,
      heroCards: content.heroCards.map(item => item.id === card.id ? card : item)
    });
  }

  private replaceCategoryImage(image: StorefrontCategoryCardImage): void {
    const content = this.homeContent();

    if (!content)
      return;

    this.homeContent.set({
      ...content,
      categoryCards: content.categoryCards.map(category => ({
        ...category,
        images: category.images.map(item => item.id === image.id ? image : item)
      }))
    });
  }

  private replaceBenefit(benefit: StorefrontBenefitItem): void {
    const content = this.homeContent();

    if (!content)
      return;

    this.homeContent.set({
      ...content,
      benefits: content.benefits.map(item => item.id === benefit.id ? benefit : item)
    });
  }

  private normaliseHomeContent(content: StorefrontHomeContent): StorefrontHomeContent {
    return {
      ...content,
      heroCards: (content.heroCards || []).map(card => ({
        ...card,
        imageUrl: this.normaliseImageUrl(card.imageUrl)
      })),
      categoryCards: (content.categoryCards || []).map(category => ({
        ...category,
        images: (category.images || []).map(image => ({
          ...image,
          imageUrl: this.normaliseImageUrl(image.imageUrl)
        }))
      })),
      benefits: content.benefits || []
    };
  }

  private normaliseImageUrl(imageUrl: string): string {
    if (!imageUrl)
      return '';

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('assets/')
    ) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
      return `${this.apiHost}${imageUrl}`;
    }

    return imageUrl;
  }

  private get apiHost(): string {
    return this.baseUrl.replace(/\/api\/?$/i, '');
  }
}