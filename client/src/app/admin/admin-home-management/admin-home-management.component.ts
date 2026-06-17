import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type HomeManagementTab = 'hero' | 'categories' | 'benefits' | 'bestSellers' | 'newsletter';

interface HomeManagementTabOption {
  key: HomeManagementTab;
  label: string;
  iconClass: string;
}

interface HomeHeroContent {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  subtitle: string;
  primaryButtonLabel: string;
  primaryButtonRoute: string;
  secondaryButtonLabel: string;
  secondaryButtonRoute: string;
  statusMessage: string;
}

interface HomeHeroImage {
  imageUrl: string;
  alt: string;
}

interface HomeCategoryCard {
  title: string;
  route: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface HomeBenefitItem {
  iconClass: string;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

interface HomeBestSellerItem {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  badge: string;
  displayOrder: number;
  isActive: boolean;
}

interface HomeNewsletterContent {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonLabel: string;
}

interface HomeSectionSummary {
  title: string;
  description: string;
  iconClass: string;
  status: string;
}

@Component({
  selector: 'app-admin-home-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-home-management.component.html',
  styleUrl: './admin-home-management.component.css'
})
export class AdminHomeManagementComponent {
  activeTab: HomeManagementTab = 'hero';
  previewMessage = '';

  tabs: HomeManagementTabOption[] = [
    { key: 'hero', label: 'Hero Section', iconClass: 'bi bi-stars' },
    { key: 'categories', label: 'Category Cards', iconClass: 'bi bi-grid' },
    { key: 'benefits', label: 'Benefits Strip', iconClass: 'bi bi-shield-check' },
    { key: 'bestSellers', label: 'Best Sellers', iconClass: 'bi bi-bag-heart' },
    { key: 'newsletter', label: 'Newsletter', iconClass: 'bi bi-envelope-heart' }
  ];

  heroContent: HomeHeroContent = {
    eyebrow: 'Confident. Strong. Unstoppable.',
    titleMain: 'Made for',
    titleAccent: 'Every You.',
    subtitle: 'Performance meets confidence in activewear that moves with you and celebrates you.',
    primaryButtonLabel: 'Shop New Arrivals',
    primaryButtonRoute: '/new-in',
    secondaryButtonLabel: 'Shop Collections',
    secondaryButtonRoute: '/shop',
    statusMessage: 'Free delivery in South Africa on orders R1000+'
  };

  heroImages: HomeHeroImage[] = [
    {
      imageUrl: 'assets/sets1.png',
      alt: 'ZivaFit activewear set preview one'
    },
    {
      imageUrl: 'assets/sets2.png',
      alt: 'ZivaFit activewear set preview two'
    },
    {
      imageUrl: 'assets/sets3.png',
      alt: 'ZivaFit activewear set preview three'
    },
    {
      imageUrl: 'assets/sets4.png',
      alt: 'ZivaFit activewear set preview four'
    }
  ];

  categoryCards: HomeCategoryCard[] = [
    {
      title: 'Leggings',
      route: '/leggings',
      imageUrl: 'assets/leggings1.png',
      displayOrder: 1,
      isActive: true
    },
    {
      title: 'Sports Bras',
      route: '/sports-bras',
      imageUrl: 'assets/bra1.png',
      displayOrder: 2,
      isActive: true
    },
    {
      title: 'Tops',
      route: '/tops',
      imageUrl: 'assets/longsleeveshirt1.png',
      displayOrder: 3,
      isActive: true
    },
    {
      title: 'Sets',
      route: '/sets',
      imageUrl: 'assets/sets1.png',
      displayOrder: 4,
      isActive: true
    },
    {
      title: 'Shorts',
      route: '/shorts',
      imageUrl: 'assets/short1.png',
      displayOrder: 5,
      isActive: true
    },
    {
      title: 'Accessories',
      route: '/accessories',
      imageUrl: 'assets/gymbag1.png',
      displayOrder: 6,
      isActive: true
    }
  ];

  benefitItems: HomeBenefitItem[] = [
    {
      iconClass: 'bi bi-leaf',
      title: 'Sustainably Made',
      description: 'Thoughtful fabrics for a better planet.',
      displayOrder: 1,
      isActive: true
    },
    {
      iconClass: 'bi bi-stars',
      title: 'Squat-Proof Confidence',
      description: 'Feel covered and supported always.',
      displayOrder: 2,
      isActive: true
    },
    {
      iconClass: 'bi bi-droplet',
      title: 'Sweat-Wicking',
      description: 'Stay cool, dry, and comfortable.',
      displayOrder: 3,
      isActive: true
    },
    {
      iconClass: 'bi bi-heart',
      title: 'Designed for Every Body',
      description: 'Inclusive sizing that celebrates you.',
      displayOrder: 4,
      isActive: true
    }
  ];

  bestSellers: HomeBestSellerItem[] = [
    {
      id: 1,
      name: 'Sculpt High-Waist Legging',
      category: 'Leggings',
      price: 'R899',
      imageUrl: 'assets/leggings3.png',
      badge: 'Best Seller',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 2,
      name: 'Power Support Sports Bra',
      category: 'Sports Bras',
      price: 'R699',
      imageUrl: 'assets/bra5.png',
      badge: 'Supportive Fit',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 3,
      name: 'Everyday Long Sleeve Top',
      category: 'Tops',
      price: 'R749',
      imageUrl: 'assets/longsleeveshirt3.png',
      badge: 'New Colour',
      displayOrder: 3,
      isActive: true
    },
    {
      id: 4,
      name: 'Studio Matching Set',
      category: 'Sets',
      price: 'R1 200',
      imageUrl: 'assets/sets5.png',
      badge: 'Full Look',
      displayOrder: 4,
      isActive: true
    }
  ];

  newsletterContent: HomeNewsletterContent = {
    title: 'Stay Inspired',
    subtitle: 'Be first to know about new drops, exclusive offers, and wellness tips.',
    placeholder: 'Enter your email',
    buttonLabel: 'Sign Me Up'
  };

  // ===============================
  // Section summaries
  // Shows admin what parts of the homepage are being prepared.
  // ===============================
  sectionSummaries: HomeSectionSummary[] = [
    {
      title: 'Hero',
      description: 'Landing title, subtitle, buttons, and hero images.',
      iconClass: 'bi bi-stars',
      status: 'Frontend draft'
    },
    {
      title: 'Categories',
      description: 'Homepage cards for Leggings, Sports Bras, Tops, Sets, Shorts, and Accessories.',
      iconClass: 'bi bi-grid',
      status: 'Frontend draft'
    },
    {
      title: 'Benefits',
      description: 'Store value messages such as support, comfort, and inclusive fit.',
      iconClass: 'bi bi-shield-check',
      status: 'Frontend draft'
    },
    {
      title: 'Best Sellers',
      description: 'Temporary product cards before backend catalogue connection.',
      iconClass: 'bi bi-bag-heart',
      status: 'Frontend draft'
    }
  ];

  // ===============================
  // Tab selection
  // Shows one Home Management section at a time.
  // ===============================
  selectTab(tab: HomeManagementTab) {
    this.activeTab = tab;
    this.previewMessage = '';
  }

  // ===============================
  // Preview update
  // Temporary frontend success state until backend saving is added.
  // ===============================
  updatePreview(sectionName: string) {
    this.previewMessage = `${sectionName} preview updated. Backend saving will be added in the Home Management API phase.`;
  }

  trackByTabKey(index: number, item: HomeManagementTabOption): string {
    return item.key;
  }

  trackBySummaryTitle(index: number, item: HomeSectionSummary): string {
    return item.title;
  }

  trackByHeroImage(index: number, item: HomeHeroImage): string {
    return item.imageUrl;
  }

  trackByCategoryTitle(index: number, item: HomeCategoryCard): string {
    return item.title;
  }

  trackByBenefitTitle(index: number, item: HomeBenefitItem): string {
    return item.title;
  }

  trackByBestSellerId(index: number, item: HomeBestSellerItem): number {
    return item.id;
  }
}