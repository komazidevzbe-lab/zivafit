import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  StorefrontBenefitItem,
  StorefrontCategoryCardImage,
  StorefrontCollectionBenefit,
  StorefrontCollectionHeroImage,
  StorefrontCollectionHeroPoint,
  StorefrontCollectionPage,
  StorefrontHeroCard,
  StorefrontHomeContent,
  UpdateStorefrontBenefitItemRequest,
  UpdateStorefrontCategoryCardImageRequest,
  UpdateStorefrontCollectionBenefitRequest,
  UpdateStorefrontCollectionHeroImageRequest,
  UpdateStorefrontCollectionHeroPointRequest,
  UpdateStorefrontCollectionPageRequest,
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
  collectionPages = signal<StorefrontCollectionPage[]>([]);

  // ===============================
  // Load Home content
  // Loads Home page hero, cards, categories, benefits, and labels from the backend.
  // ===============================
  loadHomeContent() {
    return this.http.get<StorefrontHomeContent>(this.baseUrl + 'storefront/home').pipe(
      map(content => this.normaliseHomeContent(content)),
      tap(content => this.homeContent.set(content))
    );
  }

  // ===============================
  // Load public collection pages
  // Loads public collection page content for public collection pages.
  // ===============================
  loadCollectionPages() {
    return this.http.get<StorefrontCollectionPage[]>(this.baseUrl + 'storefront/collections').pipe(
      map(pages => pages.map(page => this.normaliseCollectionPage(page))),
      tap(pages => this.collectionPages.set(pages))
    );
  }

  // ===============================
  // Load public collection page
  // Loads one public collection page by internal page key.
  // ===============================
  loadCollectionPage(pageKey: string) {
    return this.http.get<StorefrontCollectionPage>(
      this.baseUrl + `storefront/collections/${encodeURIComponent(pageKey)}`
    ).pipe(
      map(page => this.normaliseCollectionPage(page)),
      tap(page => this.replaceCollectionPage(page))
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
  // Load admin collection pages
  // Admin loads all seeded collection pages from the database.
  // ===============================
  loadAdminCollectionPages() {
    return this.http.get<StorefrontCollectionPage[]>(this.baseUrl + 'adminstorefront/collections').pipe(
      map(pages => pages.map(page => this.normaliseCollectionPage(page))),
      tap(pages => this.collectionPages.set(pages))
    );
  }

  // ===============================
  // Update admin Home content
  // Updates copy and labels only.
  // ===============================
  updateHomeContent(model: UpdateStorefrontHomeContentRequest) {
    return this.http.put<StorefrontHomeContent>(this.baseUrl + 'adminstorefront/home', model).pipe(
      map(content => this.normaliseHomeContent(content)),
      tap(content => this.homeContent.set(content))
    );
  }

  // ===============================
  // Update collection page content
  // Updates visible text only. Page keys, categories, modes, and routes are not editable.
  // ===============================
  updateCollectionPage(collectionPageId: number, model: UpdateStorefrontCollectionPageRequest) {
    return this.http.put<StorefrontCollectionPage>(
      this.baseUrl + `adminstorefront/collection-pages/${collectionPageId}`,
      model
    ).pipe(
      map(page => this.normaliseCollectionPage(page)),
      tap(page => this.replaceCollectionPage(page))
    );
  }

  // ===============================
  // Update collection hero point
  // Updates one collection hero point.
  // ===============================
  updateCollectionHeroPoint(heroPointId: number, model: UpdateStorefrontCollectionHeroPointRequest) {
    return this.http.put<StorefrontCollectionHeroPoint>(
      this.baseUrl + `adminstorefront/collection-hero-points/${heroPointId}`,
      model
    ).pipe(
      tap(point => this.replaceCollectionHeroPoint(point))
    );
  }

  // ===============================
  // Update collection hero image
  // Updates alt text only.
  // ===============================
  updateCollectionHeroImage(heroImageId: number, model: UpdateStorefrontCollectionHeroImageRequest) {
    return this.http.put<StorefrontCollectionHeroImage>(
      this.baseUrl + `adminstorefront/collection-hero-images/${heroImageId}`,
      model
    ).pipe(
      map(image => ({
        ...image,
        imageUrl: this.normaliseImageUrl(image.imageUrl)
      })),
      tap(image => this.replaceCollectionHeroImage(image))
    );
  }

  // ===============================
  // Upload collection hero image
  // Admin uploads a replacement file from their device.
  // ===============================
  uploadCollectionHeroImage(heroImageId: number, file: File, imageAlt: string) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('imageAlt', imageAlt);

    return this.http.post<StorefrontCollectionHeroImage>(
      this.baseUrl + `adminstorefront/collection-hero-images/${heroImageId}/image/upload`,
      formData
    ).pipe(
      map(image => ({
        ...image,
        imageUrl: this.normaliseImageUrl(image.imageUrl)
      })),
      tap(image => this.replaceCollectionHeroImage(image))
    );
  }

  // ===============================
  // Update collection benefit
  // Updates one collection benefit card.
  // ===============================
  updateCollectionBenefit(collectionBenefitId: number, model: UpdateStorefrontCollectionBenefitRequest) {
    return this.http.put<StorefrontCollectionBenefit>(
      this.baseUrl + `adminstorefront/collection-benefits/${collectionBenefitId}`,
      model
    ).pipe(
      tap(benefit => this.replaceCollectionBenefit(benefit))
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
  // Upload hero image
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

  private replaceCollectionPage(page: StorefrontCollectionPage): void {
    const pages = this.collectionPages();
    const exists = pages.some(item => item.id === page.id);

    if (!exists) {
      this.collectionPages.set([...pages, page]);
      return;
    }

    this.collectionPages.set(pages.map(item => item.id === page.id ? page : item));
  }

  private replaceCollectionHeroPoint(point: StorefrontCollectionHeroPoint): void {
    this.collectionPages.set(this.collectionPages().map(page => ({
      ...page,
      heroPoints: page.heroPoints.map(item => item.id === point.id ? point : item)
    })));
  }

  private replaceCollectionHeroImage(image: StorefrontCollectionHeroImage): void {
    this.collectionPages.set(this.collectionPages().map(page => ({
      ...page,
      heroImages: page.heroImages.map(item => item.id === image.id ? image : item)
    })));
  }

  private replaceCollectionBenefit(benefit: StorefrontCollectionBenefit): void {
    this.collectionPages.set(this.collectionPages().map(page => ({
      ...page,
      benefits: page.benefits.map(item => item.id === benefit.id ? benefit : item)
    })));
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

  private normaliseCollectionPage(page: StorefrontCollectionPage): StorefrontCollectionPage {
    return {
      ...page,
      heroPoints: page.heroPoints || [],
      heroImages: (page.heroImages || []).map(image => ({
        ...image,
        imageUrl: this.normaliseImageUrl(image.imageUrl)
      })),
      benefits: page.benefits || []
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