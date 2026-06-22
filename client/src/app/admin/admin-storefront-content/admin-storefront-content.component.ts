import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
} from '../../_models/storefront-content';
import { StorefrontContentService } from '../../_services/storefront-content.service';

type StorefrontContentTab = 'home' | 'collections' | 'footer';
type StorefrontPanel = 'content' | 'media' | 'categories' | 'benefits';
type CollectionPanel = 'content' | 'points' | 'media' | 'benefits';

interface StorefrontTabCard {
  key: StorefrontContentTab;
  title: string;
  text: string;
  iconClass: string;
}

@Component({
  selector: 'app-admin-storefront-content',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-storefront-content.component.html',
  styleUrl: './admin-storefront-content.component.css'
})
export class AdminStorefrontContentComponent implements OnInit {
  private storefrontContentService = inject(StorefrontContentService);

  activeTab: StorefrontContentTab = 'home';
  openPanel: StorefrontPanel = 'content';
  openCollectionPanel: CollectionPanel = 'content';

  homeContent: StorefrontHomeContent | null = null;
  collectionPages: StorefrontCollectionPage[] = [];
  selectedCollectionPageId: number | null = null;

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  private heroImageFiles = new Map<number, File>();
  private categoryImageFiles = new Map<number, File>();
  private collectionHeroImageFiles = new Map<number, File>();

  tabCards: StorefrontTabCard[] = [
    {
      key: 'home',
      title: 'Home',
      text: 'Homepage copy, hero images, category display, benefits, and best sellers',
      iconClass: 'bi bi-house'
    },
    {
      key: 'collections',
      title: 'Collections',
      text: 'Shop, New In, and public category page content',
      iconClass: 'bi bi-grid'
    },
    {
      key: 'footer',
      title: 'Footer',
      text: 'Newsletter, support text, footer links, and social content',
      iconClass: 'bi bi-layout-text-window'
    }
  ];

  ngOnInit(): void {
    this.loadHomeContent();
    this.loadCollectionPages();
  }

  // ===============================
  // Load Home content
  // Loads the same Home content used by the public homepage.
  // ===============================
  loadHomeContent(): void {
    this.isLoading = true;
    this.clearMessages();

    this.storefrontContentService.loadAdminHomeContent().subscribe({
      next: content => {
        this.homeContent = structuredClone(content);
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Home content could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Load collection pages
  // Loads public collection page content from the database for admin editing.
  // ===============================
  loadCollectionPages(): void {
    this.storefrontContentService.loadAdminCollectionPages().subscribe({
      next: pages => {
        this.collectionPages = structuredClone(pages);

        if (!this.selectedCollectionPageId && this.collectionPages.length > 0) {
          this.selectedCollectionPageId = this.collectionPages[0].id;
        }
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection page content could not be loaded.';
      }
    });
  }

  // ===============================
  // Select tab
  // Switches between storefront content areas.
  // ===============================
  selectTab(tab: StorefrontContentTab): void {
    this.activeTab = tab;
    this.openPanel = 'content';
    this.openCollectionPanel = 'content';
    this.clearMessages();

    if (tab === 'collections' && this.collectionPages.length === 0) {
      this.loadCollectionPages();
    }
  }

  // ===============================
  // Toggle Home panel
  // Opens one Home management panel at a time.
  // ===============================
  togglePanel(panel: StorefrontPanel): void {
    this.openPanel = this.openPanel === panel ? 'content' : panel;
  }

  // ===============================
  // Toggle collection panel
  // Opens one collection management panel at a time.
  // ===============================
  toggleCollectionPanel(panel: CollectionPanel): void {
    this.openCollectionPanel = this.openCollectionPanel === panel ? 'content' : panel;
  }

  // ===============================
  // Select collection page
  // Uses database collection page ID.
  // ===============================
  selectCollectionPage(collectionPageId: number): void {
    this.selectedCollectionPageId = collectionPageId;
    this.openCollectionPanel = 'content';
    this.clearMessages();
  }

  // ===============================
  // Save Home content
  // Saves visible Home copy and labels only.
  // ===============================
  saveHomeContent(): void {
    if (!this.homeContent)
      return;

    this.clearMessages();

    const request: UpdateStorefrontHomeContentRequest = {
      heroEyebrow: this.homeContent.heroEyebrow,
      heroTitle: this.homeContent.heroTitle,
      heroHighlight: this.homeContent.heroHighlight,
      heroText: this.homeContent.heroText,
      primaryButtonLabel: this.homeContent.primaryButtonLabel,
      secondaryButtonLabel: this.homeContent.secondaryButtonLabel,
      bestSellersEyebrow: this.homeContent.bestSellersEyebrow,
      bestSellersTitle: this.homeContent.bestSellersTitle,
      bestSellersLinkLabel: this.homeContent.bestSellersLinkLabel,
      productCardLinkLabel: this.homeContent.productCardLinkLabel
    };

    this.storefrontContentService.updateHomeContent(request).subscribe({
      next: content => {
        this.homeContent = structuredClone(content);
        this.successMessage = 'Home content has been saved successfully.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Home content could not be saved.';
      }
    });
  }

  // ===============================
  // Save collection page
  // Saves collection page copy and labels only.
  // Page key, mode, category, and routes stay controlled by the backend/app.
  // ===============================
  saveCollectionPage(page: StorefrontCollectionPage): void {
    const request: UpdateStorefrontCollectionPageRequest = {
      heroEyebrow: page.heroEyebrow,
      heroTitle: page.heroTitle,
      heroText: page.heroText,
      heroButtonLabel: page.heroButtonLabel,
      secondaryButtonLabel: page.secondaryButtonLabel,
      collectionEyebrow: page.collectionEyebrow,
      collectionTitle: page.collectionTitle,
      productCardLinkLabel: page.productCardLinkLabel,
      emptyTitle: page.emptyTitle,
      emptyText: page.emptyText,
      noteEyebrow: page.noteEyebrow,
      noteTitle: page.noteTitle,
      noteText: page.noteText
    };

    this.clearMessages();

    this.storefrontContentService.updateCollectionPage(page.id, request).subscribe({
      next: updatedPage => {
        this.replaceCollectionPage(updatedPage);
        this.successMessage = 'Collection page content has been saved successfully.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection page content could not be saved.';
      }
    });
  }

  // ===============================
  // Save collection hero point
  // Updates one hero point shown in the collection hero section.
  // ===============================
  saveCollectionHeroPoint(point: StorefrontCollectionHeroPoint): void {
    const request: UpdateStorefrontCollectionHeroPointRequest = {
      iconClass: point.iconClass,
      label: point.label
    };

    this.clearMessages();

    this.storefrontContentService.updateCollectionHeroPoint(point.id, request).subscribe({
      next: updatedPoint => {
        this.replaceCollectionHeroPoint(updatedPoint);
        this.successMessage = 'Collection hero point has been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection hero point could not be saved.';
      }
    });
  }

  // ===============================
  // Save collection hero image
  // Updates alt text only.
  // ===============================
  saveCollectionHeroImage(image: StorefrontCollectionHeroImage): void {
    const request: UpdateStorefrontCollectionHeroImageRequest = {
      imageAlt: image.imageAlt
    };

    this.clearMessages();

    this.storefrontContentService.updateCollectionHeroImage(image.id, request).subscribe({
      next: updatedImage => {
        this.replaceCollectionHeroImage(updatedImage);
        this.successMessage = 'Collection hero image text has been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection hero image text could not be saved.';
      }
    });
  }

  // ===============================
  // Select collection hero image file
  // Stores the selected local file for upload.
  // ===============================
  onCollectionHeroImageFileSelected(image: StorefrontCollectionHeroImage, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.collectionHeroImageFiles.set(image.id, file);
    }
  }

  // ===============================
  // Upload collection hero image
  // Uploads a replacement collection image from the admin device.
  // ===============================
  uploadCollectionHeroImage(image: StorefrontCollectionHeroImage): void {
    const file = this.collectionHeroImageFiles.get(image.id);

    if (!file)
      return;

    this.clearMessages();

    this.storefrontContentService.uploadCollectionHeroImage(
      image.id,
      file,
      image.imageAlt
    ).subscribe({
      next: updatedImage => {
        this.replaceCollectionHeroImage(updatedImage);
        this.collectionHeroImageFiles.delete(image.id);
        this.successMessage = 'Collection hero image has been uploaded successfully.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection hero image could not be uploaded.';
      }
    });
  }

  // ===============================
  // Save collection benefit
  // Updates one benefit card shown on a collection page.
  // ===============================
  saveCollectionBenefit(benefit: StorefrontCollectionBenefit): void {
    const request: UpdateStorefrontCollectionBenefitRequest = {
      iconClass: benefit.iconClass,
      title: benefit.title,
      text: benefit.text
    };

    this.clearMessages();

    this.storefrontContentService.updateCollectionBenefit(benefit.id, request).subscribe({
      next: updatedBenefit => {
        this.replaceCollectionBenefit(updatedBenefit);
        this.successMessage = 'Collection benefit has been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Collection benefit could not be saved.';
      }
    });
  }

  // ===============================
  // Save hero card
  // Saves card title and alt text only.
  // Image replacement happens through upload.
  // ===============================
  saveHeroCard(card: StorefrontHeroCard): void {
    const request: UpdateStorefrontHeroCardRequest = {
      title: card.title,
      imageAlt: card.imageAlt
    };

    this.clearMessages();

    this.storefrontContentService.updateHeroCard(card.id, request).subscribe({
      next: updatedCard => {
        this.replaceHeroCard(updatedCard);
        this.successMessage = 'Hero media details have been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Hero media details could not be saved.';
      }
    });
  }

  // ===============================
  // Select hero image file
  // Stores the selected local file for upload.
  // ===============================
  onHeroImageFileSelected(card: StorefrontHeroCard, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.heroImageFiles.set(card.id, file);
    }
  }

  // ===============================
  // Upload hero image
  // Uploads a replacement hero image from the admin device.
  // ===============================
  uploadHeroImage(card: StorefrontHeroCard): void {
    const file = this.heroImageFiles.get(card.id);

    if (!file)
      return;

    this.clearMessages();

    this.storefrontContentService.uploadHeroCardImage(card.id, file, card.imageAlt).subscribe({
      next: updatedCard => {
        this.replaceHeroCard(updatedCard);
        this.heroImageFiles.delete(card.id);
        this.successMessage = 'Hero image has been uploaded successfully.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Hero image could not be uploaded.';
      }
    });
  }

  // ===============================
  // Save category image
  // Saves alt text only.
  // Image replacement happens through upload.
  // ===============================
  saveCategoryImage(image: StorefrontCategoryCardImage): void {
    const request: UpdateStorefrontCategoryCardImageRequest = {
      imageAlt: image.imageAlt
    };

    this.clearMessages();

    this.storefrontContentService.updateCategoryCardImage(image.id, request).subscribe({
      next: updatedImage => {
        this.replaceCategoryImage(updatedImage);
        this.successMessage = 'Category image details have been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Category image details could not be saved.';
      }
    });
  }

  // ===============================
  // Select category image file
  // Stores the selected local file for upload.
  // ===============================
  onCategoryImageFileSelected(image: StorefrontCategoryCardImage, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.categoryImageFiles.set(image.id, file);
    }
  }

  // ===============================
  // Upload category image
  // Uploads a replacement category card image from the admin device.
  // ===============================
  uploadCategoryImage(image: StorefrontCategoryCardImage): void {
    const file = this.categoryImageFiles.get(image.id);

    if (!file)
      return;

    this.clearMessages();

    this.storefrontContentService.uploadCategoryCardImage(image.id, file, image.imageAlt).subscribe({
      next: updatedImage => {
        this.replaceCategoryImage(updatedImage);
        this.categoryImageFiles.delete(image.id);
        this.successMessage = 'Category image has been uploaded successfully.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Category image could not be uploaded.';
      }
    });
  }

  // ===============================
  // Save benefit
  // Updates Home benefit item content.
  // ===============================
  saveBenefit(benefit: StorefrontBenefitItem): void {
    const request: UpdateStorefrontBenefitItemRequest = {
      iconClass: benefit.iconClass,
      title: benefit.title,
      text: benefit.text
    };

    this.clearMessages();

    this.storefrontContentService.updateBenefitItem(benefit.id, request).subscribe({
      next: updatedBenefit => {
        this.replaceBenefit(updatedBenefit);
        this.successMessage = 'Benefit item has been saved.';
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Benefit item could not be saved.';
      }
    });
  }

  hasHeroFile(cardId: number): boolean {
    return this.heroImageFiles.has(cardId);
  }

  hasCategoryFile(imageId: number): boolean {
    return this.categoryImageFiles.has(imageId);
  }

  hasCollectionHeroFile(imageId: number): boolean {
    return this.collectionHeroImageFiles.has(imageId);
  }

  get selectedCollectionPage(): StorefrontCollectionPage | null {
    if (!this.selectedCollectionPageId)
      return null;

    return this.collectionPages.find(page => page.id === this.selectedCollectionPageId) || null;
  }

  trackByTabKey(index: number, item: StorefrontTabCard): StorefrontContentTab {
    return item.key;
  }

  trackByHeroCardId(index: number, item: StorefrontHeroCard): number {
    return item.id;
  }

  trackByCategoryCardId(index: number, item: { id: number }): number {
    return item.id;
  }

  trackByCategoryImageId(index: number, item: StorefrontCategoryCardImage): number {
    return item.id;
  }

  trackByBenefitId(index: number, item: StorefrontBenefitItem): number {
    return item.id;
  }

  trackByCollectionPageId(index: number, item: StorefrontCollectionPage): number {
    return item.id;
  }

  trackByCollectionHeroPointId(index: number, item: StorefrontCollectionHeroPoint): number {
    return item.id;
  }

  trackByCollectionHeroImageId(index: number, item: StorefrontCollectionHeroImage): number {
    return item.id;
  }

  trackByCollectionBenefitId(index: number, item: StorefrontCollectionBenefit): number {
    return item.id;
  }

  private replaceHeroCard(card: StorefrontHeroCard): void {
    if (!this.homeContent)
      return;

    this.homeContent = {
      ...this.homeContent,
      heroCards: this.homeContent.heroCards.map(item => item.id === card.id ? card : item)
    };
  }

  private replaceCategoryImage(image: StorefrontCategoryCardImage): void {
    if (!this.homeContent)
      return;

    this.homeContent = {
      ...this.homeContent,
      categoryCards: this.homeContent.categoryCards.map(category => ({
        ...category,
        images: category.images.map(item => item.id === image.id ? image : item)
      }))
    };
  }

  private replaceBenefit(benefit: StorefrontBenefitItem): void {
    if (!this.homeContent)
      return;

    this.homeContent = {
      ...this.homeContent,
      benefits: this.homeContent.benefits.map(item => item.id === benefit.id ? benefit : item)
    };
  }

  private replaceCollectionPage(page: StorefrontCollectionPage): void {
    this.collectionPages = this.collectionPages.map(item => item.id === page.id ? structuredClone(page) : item);
  }

  private replaceCollectionHeroPoint(point: StorefrontCollectionHeroPoint): void {
    this.collectionPages = this.collectionPages.map(page => ({
      ...page,
      heroPoints: page.heroPoints.map(item => item.id === point.id ? point : item)
    }));
  }

  private replaceCollectionHeroImage(image: StorefrontCollectionHeroImage): void {
    this.collectionPages = this.collectionPages.map(page => ({
      ...page,
      heroImages: page.heroImages.map(item => item.id === image.id ? image : item)
    }));
  }

  private replaceCollectionBenefit(benefit: StorefrontCollectionBenefit): void {
    this.collectionPages = this.collectionPages.map(page => ({
      ...page,
      benefits: page.benefits.map(item => item.id === benefit.id ? benefit : item)
    }));
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}