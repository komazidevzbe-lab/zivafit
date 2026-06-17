import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type LeggingFilter = 'All' | 'High Waist' | 'Bootleg' | 'Pocket' | 'Seamless';
type LeggingSort = 'featured' | 'priceLow' | 'priceHigh' | 'name';

interface LeggingProduct {
  id: number;
  name: string;
  fitType: LeggingFilter;
  price: number;
  priceText: string;
  colour: string;
  imageUrl: string;
  imageAlt: string;
  badge: string;
  sizes: string[];
  isNew: boolean;
  isBestSeller: boolean;
}

interface LeggingHeroImage {
  imageUrl: string;
  imageAlt: string;
}

interface LeggingFilterOption {
  label: LeggingFilter;
}

@Component({
  selector: 'app-leggings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leggings.component.html',
  styleUrl: './leggings.component.css'
})
export class LeggingsComponent {
  activeFilter: LeggingFilter = 'All';
  selectedSort: LeggingSort = 'featured';

  ratingStars = [1, 2, 3, 4, 5];

  heroImages: LeggingHeroImage[] = [
    {
      imageUrl: 'assets/leggings1.png',
      imageAlt: 'ZivaFit high-waist leggings in black'
    },
    {
      imageUrl: 'assets/leggings3.png',
      imageAlt: 'ZivaFit sculpt leggings in a warm neutral colour'
    },
    {
      imageUrl: 'assets/bootlegleggings1.png',
      imageAlt: 'ZivaFit bootleg leggings activewear look'
    }
  ];

  filterOptions: LeggingFilterOption[] = [
    { label: 'All' },
    { label: 'High Waist' },
    { label: 'Bootleg' },
    { label: 'Pocket' },
    { label: 'Seamless' }
  ];

  products: LeggingProduct[] = [
    {
      id: 101,
      name: 'Sculpt High-Waist Legging',
      fitType: 'High Waist',
      price: 899,
      priceText: 'R899',
      colour: 'Black',
      imageUrl: 'assets/leggings1.png',
      imageAlt: 'Black sculpt high-waist ZivaFit leggings',
      badge: 'Best Seller',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      isNew: false,
      isBestSeller: true
    },
    {
      id: 102,
      name: 'Contour Pocket Legging',
      fitType: 'Pocket',
      price: 949,
      priceText: 'R949',
      colour: 'Deep Cocoa',
      imageUrl: 'assets/leggings2.png',
      imageAlt: 'Deep cocoa ZivaFit pocket leggings',
      badge: 'Pocket Fit',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      isNew: true,
      isBestSeller: false
    },
    {
      id: 103,
      name: 'Espresso Core Legging',
      fitType: 'High Waist',
      price: 849,
      priceText: 'R849',
      colour: 'Espresso',
      imageUrl: 'assets/leggings3.png',
      imageAlt: 'Espresso ZivaFit high-waist leggings',
      badge: 'Core Fit',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isNew: false,
      isBestSeller: false
    },
    {
      id: 104,
      name: 'Olive Move Legging',
      fitType: 'High Waist',
      price: 899,
      priceText: 'R899',
      colour: 'Olive',
      imageUrl: 'assets/leggings4.png',
      imageAlt: 'Olive ZivaFit activewear leggings',
      badge: 'Gym Ready',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      isNew: true,
      isBestSeller: false
    },
    {
      id: 105,
      name: 'Cream Align Legging',
      fitType: 'Seamless',
      price: 899,
      priceText: 'R899',
      colour: 'Cream',
      imageUrl: 'assets/leggings5.png',
      imageAlt: 'Cream seamless ZivaFit leggings',
      badge: 'Seamless',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      isNew: false,
      isBestSeller: true
    },
    {
      id: 106,
      name: 'Cocoa Compression Legging',
      fitType: 'Seamless',
      price: 999,
      priceText: 'R999',
      colour: 'Cocoa',
      imageUrl: 'assets/leggings6.png',
      imageAlt: 'Cocoa compression ZivaFit leggings',
      badge: 'Compression',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isNew: false,
      isBestSeller: false
    },
    {
      id: 107,
      name: 'Auburn Flex Legging',
      fitType: 'High Waist',
      price: 799,
      priceText: 'R799',
      colour: 'Auburn',
      imageUrl: 'assets/leggings8.png',
      imageAlt: 'Auburn ZivaFit flexible leggings',
      badge: 'Everyday Fit',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      isNew: false,
      isBestSeller: false
    },
    {
      id: 108,
      name: 'Brown Pocket Legging',
      fitType: 'Pocket',
      price: 899,
      priceText: 'R899',
      colour: 'Brown',
      imageUrl: 'assets/leggings9.png',
      imageAlt: 'Brown pocket ZivaFit leggings',
      badge: 'Pocket Fit',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isNew: true,
      isBestSeller: false
    },
    {
      id: 109,
      name: 'Studio Stretch Legging',
      fitType: 'High Waist',
      price: 849,
      priceText: 'R849',
      colour: 'Warm Taupe',
      imageUrl: 'assets/leggings10.png',
      imageAlt: 'Warm taupe ZivaFit stretch leggings',
      badge: 'Studio Fit',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      isNew: false,
      isBestSeller: false
    },
    {
      id: 110,
      name: 'Everyday Black Bootleg',
      fitType: 'Bootleg',
      price: 899,
      priceText: 'R899',
      colour: 'Black',
      imageUrl: 'assets/bootlegleggings1.png',
      imageAlt: 'Black ZivaFit bootleg leggings',
      badge: 'Bootleg',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      isNew: false,
      isBestSeller: true
    },
    {
      id: 111,
      name: 'Mocha Bootleg Legging',
      fitType: 'Bootleg',
      price: 949,
      priceText: 'R949',
      colour: 'Mocha',
      imageUrl: 'assets/bootlegleggings2.png',
      imageAlt: 'Mocha ZivaFit bootleg leggings',
      badge: 'Soft Flare',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      isNew: true,
      isBestSeller: false
    },
    {
      id: 112,
      name: 'Sculpt Flare Bootleg',
      fitType: 'Bootleg',
      price: 999,
      priceText: 'R999',
      colour: 'Chocolate',
      imageUrl: 'assets/bootlegleggings3.png',
      imageAlt: 'Chocolate ZivaFit sculpt flare bootleg leggings',
      badge: 'Flare Fit',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isNew: false,
      isBestSeller: false
    }
  ];

  // ===============================
  // Filtered products
  // Keeps the page public while allowing browsing by legging style.
  // ===============================
  get filteredProducts(): LeggingProduct[] {
    const filtered = this.activeFilter === 'All'
      ? [...this.products]
      : this.products.filter(product => product.fitType === this.activeFilter);

    return this.sortProducts(filtered);
  }

  get productCountText(): string {
    const count = this.filteredProducts.length;
    return count === 1 ? '1 style' : `${count} styles`;
  }

  setActiveFilter(filter: LeggingFilter): void {
    this.activeFilter = filter;
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LeggingSort;
    this.selectedSort = value;
  }

  getFilterCount(filter: LeggingFilter): number {
    if (filter === 'All')
      return this.products.length;

    return this.products.filter(product => product.fitType === filter).length;
  }

  trackByProductId(index: number, product: LeggingProduct): number {
    return product.id;
  }

  trackByFilterLabel(index: number, filter: LeggingFilterOption): string {
    return filter.label;
  }

  trackByHeroImage(index: number, image: LeggingHeroImage): string {
    return image.imageUrl;
  }

  trackBySize(index: number, size: string): string {
    return size;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }

  // ===============================
  // Product sorting
  // Sorts temporary frontend products before backend catalogue connection.
  // ===============================
  private sortProducts(products: LeggingProduct[]): LeggingProduct[] {
    switch (this.selectedSort) {
      case 'priceLow':
        return [...products].sort((a, b) => a.price - b.price);

      case 'priceHigh':
        return [...products].sort((a, b) => b.price - a.price);

      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));

      default:
        return [...products].sort((a, b) => {
          if (a.isBestSeller !== b.isBestSeller)
            return a.isBestSeller ? -1 : 1;

          if (a.isNew !== b.isNew)
            return a.isNew ? -1 : 1;

          return a.id - b.id;
        });
    }
  }
}