import { Injectable, signal } from '@angular/core';

import {
  AdminCollectionPageContent,
  AdminCustomer,
  AdminFooterContent,
  AdminHomeContent,
  AdminNewsletterSubscriber,
  AdminOrder,
  AdminProduct,
  AdminProductCategory,
  AdminProductVariant,
  AdminReview,
  AdminStoreSettings
} from '../_models/admin-management';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {
  homeContent = signal<AdminHomeContent>({
    heroEyebrow: 'ZivaFit Activewear',
    heroTitle: 'Move Beautifully.',
    heroHighlight: 'Feel Powerful.',
    heroText: 'Premium activewear for women who move with strength, softness, confidence, and purpose.',
    primaryButtonLabel: 'Shop New In',
    primaryButtonRoute: '/new-in',
    secondaryButtonLabel: 'Explore Collections',
    secondaryButtonRoute: '/shop',
    heroCards: [
      {
        title: 'ZivaFit Set One',
        imageUrl: 'assets/sets1.png',
        imageAlt: 'Woman wearing a ZivaFit activewear set',
        cardClass: 'card-one'
      },
      {
        title: 'ZivaFit Set Two',
        imageUrl: 'assets/sets2.png',
        imageAlt: 'Woman posing in a matching ZivaFit gym set',
        cardClass: 'card-two'
      },
      {
        title: 'ZivaFit Set Three',
        imageUrl: 'assets/sets3.png',
        imageAlt: 'ZivaFit activewear set styled for gym and movement',
        cardClass: 'card-three'
      },
      {
        title: 'ZivaFit Set Four',
        imageUrl: 'assets/sets4.png',
        imageAlt: 'Woman wearing a premium ZivaFit matching set',
        cardClass: 'card-four'
      }
    ],
    categoryCards: [
      {
        title: 'Leggings',
        route: '/leggings',
        displayOrder: 1,
        images: [
          { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit leggings product preview' },
          { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit high-waist leggings product preview' }
        ]
      },
      {
        title: 'Sports Bras',
        route: '/sports-bras',
        displayOrder: 2,
        images: [
          { imageUrl: 'assets/bra1.png', imageAlt: 'ZivaFit sports bra product preview' },
          { imageUrl: 'assets/bra2.png', imageAlt: 'ZivaFit supportive sports bra' }
        ]
      },
      {
        title: 'Tops',
        route: '/tops',
        displayOrder: 3,
        images: [
          { imageUrl: 'assets/longsleeveshirt1.png', imageAlt: 'ZivaFit long sleeve gym top' },
          { imageUrl: 'assets/shortsleeveshirt1.png', imageAlt: 'ZivaFit short sleeve activewear top' }
        ]
      },
      {
        title: 'Sets',
        route: '/sets',
        displayOrder: 4,
        images: [
          { imageUrl: 'assets/sets1.png', imageAlt: 'ZivaFit matching activewear set' },
          { imageUrl: 'assets/sets3.png', imageAlt: 'ZivaFit premium activewear set' }
        ]
      },
      {
        title: 'Shorts',
        route: '/shorts',
        displayOrder: 5,
        images: [
          { imageUrl: 'assets/short1.png', imageAlt: 'ZivaFit activewear shorts' },
          { imageUrl: 'assets/skort1.png', imageAlt: 'ZivaFit skort activewear product preview' }
        ]
      },
      {
        title: 'Accessories',
        route: '/accessories',
        displayOrder: 6,
        images: [
          { imageUrl: 'assets/gymbag1.png', imageAlt: 'ZivaFit gym bag product preview' },
          { imageUrl: 'assets/gymbag3.png', imageAlt: 'ZivaFit gym duffle bag' }
        ]
      }
    ],
    benefits: [
      {
        iconClass: 'bi bi-truck',
        title: 'Nationwide Delivery',
        text: 'Prepared for shipping across South Africa.'
      },
      {
        iconClass: 'bi bi-shield-check',
        title: 'Secure Checkout',
        text: 'Safe shopping experience for every customer.'
      },
      {
        iconClass: 'bi bi-droplet',
        title: 'Sweat-Wicking',
        text: 'Stay cool, dry, and comfortable.'
      },
      {
        iconClass: 'bi bi-heart',
        title: 'Designed for Every Body',
        text: 'Inclusive sizing that celebrates you.'
      }
    ],
    bestSellersEyebrow: 'Customer favourites',
    bestSellersTitle: 'Best Sellers',
    bestSellersLinkLabel: 'Shop all best sellers'
  });

  collectionPages = signal<AdminCollectionPageContent[]>([
    {
      pageKey: 'shop',
      pageName: 'Shop',
      mode: 'all',
      filterType: 'category',
      heroEyebrow: 'ZivaFit Shop',
      heroTitle: 'Activewear For Every Move.',
      heroText: 'Browse the full ZivaFit range, from supportive staples to complete activewear looks.',
      heroButtonLabel: 'Shop Products',
      secondaryButtonLabel: 'View New In',
      secondaryButtonRoute: '/new-in',
      heroPoints: [
        { iconClass: 'bi bi-check2-circle', label: 'Premium everyday fit' },
        { iconClass: 'bi bi-check2-circle', label: 'Warm neutral colours' },
        { iconClass: 'bi bi-check2-circle', label: 'South African store' }
      ],
      heroImages: [
        { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit leggings product preview' },
        { imageUrl: 'assets/sets5.png', imageAlt: 'ZivaFit matching set product preview' },
        { imageUrl: 'assets/gymbag5.png', imageAlt: 'ZivaFit gym bag product preview' }
      ],
      benefits: [
        { iconClass: 'bi bi-grid', title: 'Full catalogue', text: 'Leggings, sports bras, tops, sets, shorts, and accessories.' },
        { iconClass: 'bi bi-heart', title: 'Designed for confidence', text: 'Clean, premium pieces for different movement styles.' },
        { iconClass: 'bi bi-shield-check', title: 'Built for comfort', text: 'Supportive fits for training, errands, and everyday wear.' }
      ],
      collectionEyebrow: 'Browse all',
      collectionTitle: 'Shop',
      emptyTitle: 'No products found',
      emptyText: 'Try another filter to view more ZivaFit products.',
      noteEyebrow: 'Shop note',
      noteTitle: 'One catalogue structure for the full store.',
      noteText: 'This Shop page will fetch real products, categories, variants, stock, and images from the database during the backend phase.'
    },
    {
      pageKey: 'new-in',
      pageName: 'New In',
      mode: 'new',
      filterType: 'category',
      heroEyebrow: 'ZivaFit New In',
      heroTitle: 'Fresh Activewear Just Landed.',
      heroText: 'Discover the latest ZivaFit drops across leggings, sports bras, tops, sets, shorts, and accessories.',
      heroButtonLabel: 'Shop New In',
      secondaryButtonLabel: 'View All Products',
      secondaryButtonRoute: '/shop',
      heroPoints: [
        { iconClass: 'bi bi-check2-circle', label: 'Latest arrivals' },
        { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' },
        { iconClass: 'bi bi-check2-circle', label: 'Delivery in South Africa' }
      ],
      heroImages: [
        { imageUrl: 'assets/sets1.png', imageAlt: 'ZivaFit new matching activewear set' },
        { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit new pocket leggings' },
        { imageUrl: 'assets/bra1.png', imageAlt: 'ZivaFit new sports bra' }
      ],
      benefits: [
        { iconClass: 'bi bi-stars', title: 'Fresh drops', text: 'New colours, updated fits, and fresh outfit ideas.' },
        { iconClass: 'bi bi-bag-heart', title: 'Full outfits', text: 'Build complete looks from activewear to accessories.' },
        { iconClass: 'bi bi-truck', title: 'Nationwide delivery', text: 'Prepared for shipping across South Africa.' }
      ],
      collectionEyebrow: 'Latest arrivals',
      collectionTitle: 'New In',
      emptyTitle: 'No new arrivals found',
      emptyText: 'Try another filter to view more ZivaFit products.',
      noteEyebrow: 'New in note',
      noteTitle: 'Fresh pieces without changing the ZivaFit feel.',
      noteText: 'New In will be controlled by the product isNew flag in the backend product catalogue.'
    },
    {
      pageKey: 'leggings',
      pageName: 'Leggings',
      mode: 'category',
      category: 'Leggings',
      filterType: 'style',
      heroEyebrow: 'ZivaFit Leggings',
      heroTitle: 'Leggings Made To Move.',
      heroText: 'High-waist, pocket, seamless, and bootleg leggings designed for comfort, confidence, and everyday movement.',
      heroButtonLabel: 'Shop Leggings',
      secondaryButtonLabel: 'View All Products',
      secondaryButtonRoute: '/shop',
      heroPoints: [
        { iconClass: 'bi bi-check2-circle', label: 'Squat-proof support' },
        { iconClass: 'bi bi-check2-circle', label: 'Inclusive sizing' },
        { iconClass: 'bi bi-check2-circle', label: 'Delivery in South Africa' }
      ],
      heroImages: [
        { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit black sculpt leggings' },
        { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit cocoa pocket leggings' },
        { imageUrl: 'assets/bootlegleggings1.png', imageAlt: 'ZivaFit black bootleg leggings' }
      ],
      benefits: [
        { iconClass: 'bi bi-shield-check', title: 'Supportive fits', text: 'Made to hold, smooth, and move with you.' },
        { iconClass: 'bi bi-droplet-half', title: 'Sweat-wicking comfort', text: 'Designed for gym sessions and everyday wear.' },
        { iconClass: 'bi bi-stars', title: 'Premium everyday style', text: 'Warm neutrals, bold basics, and flattering cuts.' }
      ],
      collectionEyebrow: 'Shop the collection',
      collectionTitle: 'Leggings',
      emptyTitle: 'No leggings found',
      emptyText: 'Try another filter to view more ZivaFit leggings.',
      noteEyebrow: 'Fit note',
      noteTitle: 'Leggings should feel secure, smooth, and easy to move in.',
      noteText: 'Leggings page content will later be loaded from the database and controlled by admin.'
    }
  ]);

  footerContent = signal<AdminFooterContent>({
    newsletterHeading: 'Stay Inspired',
    newsletterText: 'Be first to know about new drops, exclusive offers, and wellness tips.',
    footerBrandText: 'Activewear that empowers you to move with strength, confidence, and purpose.',
    supportEmail: 'support@zivafit.co.za',
    supportHours: 'Mon – Fri, 9AM – 6PM',
    shippingText: 'Shipping nationwide',
    instagramUrl: '',
    tiktokUrl: '',
    pinterestUrl: '',
    facebookUrl: '',
    youtubeUrl: ''
  });

  products = signal<AdminProduct[]>([
    {
      id: 1,
      name: 'Cocoa Sculpt High-Waist Leggings',
      category: 'Leggings',
      fitType: 'High-Waist',
      description: 'Supportive high-waist leggings for training, errands, and everyday movement.',
      price: 699,
      colour: 'Cocoa',
      badge: 'Best Seller',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageUrl: 'assets/leggings1.png',
      imageAlt: 'ZivaFit cocoa sculpt high-waist leggings',
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      isActive: true,
      displayOrder: 1,
      images: [
        { imageUrl: 'assets/leggings1.png', imageAlt: 'ZivaFit cocoa sculpt high-waist leggings', displayOrder: 1, isMain: true },
        { imageUrl: 'assets/leggings2.png', imageAlt: 'ZivaFit leggings side view', displayOrder: 2, isMain: false }
      ]
    },
    {
      id: 2,
      name: 'Black Support Sports Bra',
      category: 'Sports Bras',
      fitType: 'High Support',
      description: 'Supportive sports bra made for gym sessions and confident movement.',
      price: 499,
      colour: 'Black',
      badge: 'New',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageUrl: 'assets/bra5.png',
      imageAlt: 'ZivaFit black support sports bra',
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
      displayOrder: 2,
      images: [
        { imageUrl: 'assets/bra5.png', imageAlt: 'ZivaFit black support sports bra', displayOrder: 1, isMain: true }
      ]
    },
    {
      id: 3,
      name: 'Cream Studio Matching Set',
      category: 'Sets',
      fitType: 'Matching Set',
      description: 'A polished matching set for studio days, walks, errands, and active routines.',
      price: 1200,
      colour: 'Cream',
      badge: 'Featured',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageUrl: 'assets/sets1.png',
      imageAlt: 'ZivaFit cream studio matching set',
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      isActive: true,
      displayOrder: 3,
      images: [
        { imageUrl: 'assets/sets1.png', imageAlt: 'ZivaFit cream studio matching set', displayOrder: 1, isMain: true }
      ]
    }
  ]);

  productCategories = signal<AdminProductCategory[]>([
    {
      id: 1,
      name: 'Leggings',
      description: 'High-waist, seamless, pocket, and bootleg leggings.',
      imageUrl: 'assets/leggings1.png',
      imageAlt: 'ZivaFit leggings category',
      displayOrder: 1,
      showInNavbar: true,
      isActive: true
    },
    {
      id: 2,
      name: 'Sports Bras',
      description: 'Supportive sports bras for different movement needs.',
      imageUrl: 'assets/bra1.png',
      imageAlt: 'ZivaFit sports bras category',
      displayOrder: 2,
      showInNavbar: true,
      isActive: true
    },
    {
      id: 3,
      name: 'Sets',
      description: 'Matching activewear sets for complete outfit styling.',
      imageUrl: 'assets/sets1.png',
      imageAlt: 'ZivaFit sets category',
      displayOrder: 3,
      showInNavbar: true,
      isActive: true
    }
  ]);

  variants = signal<AdminProductVariant[]>([
    { id: 1, productId: 1, colour: 'Cocoa', size: 'S', stockQuantity: 14, sku: 'ZVF-LEG-COC-S', isActive: true },
    { id: 2, productId: 1, colour: 'Cocoa', size: 'M', stockQuantity: 9, sku: 'ZVF-LEG-COC-M', isActive: true },
    { id: 3, productId: 2, colour: 'Black', size: 'M', stockQuantity: 5, sku: 'ZVF-BRA-BLK-M', isActive: true },
    { id: 4, productId: 3, colour: 'Cream', size: 'L', stockQuantity: 2, sku: 'ZVF-SET-CRM-L', isActive: true }
  ]);

  orders = signal<AdminOrder[]>([
    {
      id: 1,
      orderNumber: 'ZVF-1001',
      customerName: 'Anele Mokoena',
      customerEmail: 'anele@example.com',
      orderDate: '2026-06-19',
      total: 1198,
      paymentStatus: 'Paid',
      orderStatus: 'Packed',
      itemCount: 2
    },
    {
      id: 2,
      orderNumber: 'ZVF-1002',
      customerName: 'Lerato Nkosi',
      customerEmail: 'lerato@example.com',
      orderDate: '2026-06-18',
      total: 699,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      itemCount: 1
    }
  ]);

  customers = signal<AdminCustomer[]>([
    {
      id: 1,
      fullName: 'Anele Mokoena',
      email: 'anele@example.com',
      joinDate: '2026-06-01',
      orderCount: 3,
      totalSpend: 2897,
      isActive: true
    },
    {
      id: 2,
      fullName: 'Lerato Nkosi',
      email: 'lerato@example.com',
      joinDate: '2026-06-08',
      orderCount: 1,
      totalSpend: 699,
      isActive: true
    }
  ]);

  reviews = signal<AdminReview[]>([
    {
      id: 1,
      productName: 'Cocoa Sculpt High-Waist Leggings',
      customerName: 'Anele Mokoena',
      rating: 5,
      comment: 'Comfortable fit and beautiful colour.',
      reviewDate: '2026-06-18',
      status: 'Pending'
    },
    {
      id: 2,
      productName: 'Cream Studio Matching Set',
      customerName: 'Lerato Nkosi',
      rating: 4,
      comment: 'Lovely set and easy to style.',
      reviewDate: '2026-06-17',
      status: 'Approved'
    }
  ]);

  newsletterSubscribers = signal<AdminNewsletterSubscriber[]>([
    {
      id: 1,
      email: 'anele@example.com',
      subscribedDate: '2026-06-12',
      isActive: true
    },
    {
      id: 2,
      email: 'lerato@example.com',
      subscribedDate: '2026-06-15',
      isActive: true
    }
  ]);

  storeSettings = signal<AdminStoreSettings>({
    storeName: 'ZivaFit',
    supportEmail: 'support@zivafit.co.za',
    businessHours: 'Mon – Fri, 9AM – 6PM',
    deliveryFee: 99,
    freeDeliveryThreshold: 1000,
    shippingMessage: 'Shipping nationwide',
    currencyCode: 'ZAR',
    country: 'South Africa'
  });

  updateHomeContent(content: AdminHomeContent): void {
    this.homeContent.set(structuredClone(content));
  }

  updateCollectionPage(page: AdminCollectionPageContent): void {
    this.collectionPages.set(
      this.collectionPages().map(item =>
        item.pageKey === page.pageKey ? structuredClone(page) : item
      )
    );
  }

  updateFooterContent(content: AdminFooterContent): void {
    this.footerContent.set(structuredClone(content));
  }

  addProduct(product: AdminProduct): void {
    const nextId = this.getNextId(this.products());
    this.products.set([
      ...this.products(),
      {
        ...structuredClone(product),
        id: nextId
      }
    ]);
  }

  updateProduct(product: AdminProduct): void {
    this.products.set(
      this.products().map(item =>
        item.id === product.id ? structuredClone(product) : item
      )
    );
  }

  deleteProduct(productId: number): void {
    this.products.set(this.products().filter(product => product.id !== productId));
  }

  updateOrderStatus(orderId: number, status: AdminOrder['orderStatus']): void {
    this.orders.set(
      this.orders().map(order =>
        order.id === orderId ? { ...order, orderStatus: status } : order
      )
    );
  }

  updateReviewStatus(reviewId: number, status: AdminReview['status']): void {
    this.reviews.set(
      this.reviews().map(review =>
        review.id === reviewId ? { ...review, status } : review
      )
    );
  }

  toggleSubscriberStatus(subscriberId: number): void {
    this.newsletterSubscribers.set(
      this.newsletterSubscribers().map(subscriber =>
        subscriber.id === subscriberId
          ? { ...subscriber, isActive: !subscriber.isActive }
          : subscriber
      )
    );
  }

  updateStoreSettings(settings: AdminStoreSettings): void {
    this.storeSettings.set(structuredClone(settings));
  }

  private getNextId(items: { id: number }[]): number {
    if (items.length === 0)
      return 1;

    return Math.max(...items.map(item => item.id)) + 1;
  }
}