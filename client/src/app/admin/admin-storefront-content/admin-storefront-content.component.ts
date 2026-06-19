import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  AdminCollectionPageContent,
  AdminFooterContent,
  AdminHomeContent
} from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

type StorefrontContentTab = 'home' | 'collections' | 'footer';
type StorefrontPanel = 'content' | 'media' | 'layout' | 'advanced';

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
  private adminManagementService = inject(AdminManagementService);

  activeTab: StorefrontContentTab = 'home';
  openPanel: StorefrontPanel = 'content';

  homeContent!: AdminHomeContent;
  footerContent!: AdminFooterContent;
  collectionPages: AdminCollectionPageContent[] = [];
  selectedCollectionPage!: AdminCollectionPageContent;

  successMessage = '';

  tabCards: StorefrontTabCard[] = [
    {
      key: 'home',
      title: 'Home',
      text: 'Hero, categories, benefits, and best sellers',
      iconClass: 'bi bi-house'
    },
    {
      key: 'collections',
      title: 'Collections',
      text: 'Shop, New In, and category page content',
      iconClass: 'bi bi-grid'
    },
    {
      key: 'footer',
      title: 'Footer',
      text: 'Newsletter, support text, and social links',
      iconClass: 'bi bi-layout-text-window'
    }
  ];

  ngOnInit(): void {
    this.homeContent = structuredClone(this.adminManagementService.homeContent());
    this.footerContent = structuredClone(this.adminManagementService.footerContent());
    this.collectionPages = structuredClone(this.adminManagementService.collectionPages());
    this.selectedCollectionPage = structuredClone(this.collectionPages[0]);
  }

  selectTab(tab: StorefrontContentTab): void {
    this.activeTab = tab;
    this.openPanel = 'content';
    this.successMessage = '';
  }

  togglePanel(panel: StorefrontPanel): void {
    this.openPanel = this.openPanel === panel ? 'content' : panel;
  }

  isPanelOpen(panel: StorefrontPanel): boolean {
    return this.openPanel === panel;
  }

  selectCollectionPage(pageKey: string): void {
    const page = this.collectionPages.find(item => item.pageKey === pageKey);

    if (!page)
      return;

    this.selectedCollectionPage = structuredClone(page);
    this.successMessage = '';
  }

  saveHomeContent(): void {
    this.adminManagementService.updateHomeContent(this.homeContent);
    this.successMessage = 'Homepage content has been saved in mock admin data.';
  }

  saveCollectionPage(): void {
    this.adminManagementService.updateCollectionPage(this.selectedCollectionPage);

    this.collectionPages = this.collectionPages.map(page =>
      page.pageKey === this.selectedCollectionPage.pageKey
        ? structuredClone(this.selectedCollectionPage)
        : page
    );

    this.successMessage = `${this.selectedCollectionPage.pageName} content has been saved in mock admin data.`;
  }

  saveFooterContent(): void {
    this.adminManagementService.updateFooterContent(this.footerContent);
    this.successMessage = 'Footer and layout content has been saved in mock admin data.';
  }

  trackByPageKey(index: number, item: AdminCollectionPageContent): string {
    return item.pageKey;
  }

  trackByTabKey(index: number, item: StorefrontTabCard): StorefrontContentTab {
    return item.key;
  }
}