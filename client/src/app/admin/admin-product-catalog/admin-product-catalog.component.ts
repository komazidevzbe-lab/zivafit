import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductCatalogCategory,
  ProductCatalogImage,
  ProductCatalogItem,
  ProductCatalogVariant,
  ProductCategory,
  UpdateProductImageRequest,
  UpdateProductRequest,
  UpdateProductVariantRequest
} from '../../_models/product-catalog';
import { ProductCatalogService } from '../../_services/product-catalog.service';

@Component({
  selector: 'app-admin-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-product-catalog.component.html',
  styleUrl: './admin-product-catalog.component.css'
})
export class AdminProductCatalogComponent implements OnInit {
  private productCatalogService = inject(ProductCatalogService);

  products: ProductCatalogItem[] = [];
  categories: ProductCatalogCategory[] = [];

  activeCategory: ProductCategory = 'Leggings';

  selectedProduct: ProductCatalogItem | null = null;
  isCreatingProduct = false;

  sizesText = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  selectedImageFile: File | null = null;
  uploadImageAlt = '';
  uploadAsMain = false;

  newVariant: ProductCatalogVariant = this.createEmptyVariant();

  fallbackCategories: ProductCategory[] = [
    'Leggings',
    'Sports Bras',
    'Tops',
    'Sets',
    'Shorts',
    'Accessories'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  // ===============================
  // Load data
  // Loads admin products and categories from the API.
  // Products are displayed by category tabs.
  // ===============================
  loadData(selectedProductId?: number): void {
    this.isLoading = true;
    this.clearMessages();

    forkJoin({
      products: this.productCatalogService.loadAdminProducts(),
      categories: this.productCatalogService.loadAdminCategories()
    }).subscribe({
      next: result => {
        this.products = result.products;
        this.categories = result.categories;

        if (this.categories.length > 0 && !this.categories.some(category => category.name === this.activeCategory)) {
          this.activeCategory = this.categories[0].name;
        }

        if (selectedProductId) {
          this.loadSelectedProduct(selectedProductId);
          return;
        }

        this.selectedProduct = null;
        this.isCreatingProduct = false;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Product catalogue could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Select category
  // Shows products only for the selected category.
  // ===============================
  selectCategory(category: ProductCategory): void {
    this.activeCategory = category;
    this.selectedProduct = null;
    this.isCreatingProduct = false;
    this.resetUploadForm();
    this.clearMessages();
  }

  // ===============================
  // Select product
  // Loads the full product detail record, including images and variants.
  // ===============================
  selectProduct(productId: number | string): void {
    const id = Number(productId);

    if (!id)
      return;

    this.loadSelectedProduct(id);
  }

  // ===============================
  // Load selected product
  // Gets the full admin product record from the API.
  // ===============================
  private loadSelectedProduct(productId: number): void {
    this.isLoading = true;

    this.productCatalogService.getAdminProduct(productId).subscribe({
      next: product => {
        this.selectedProduct = structuredClone(product);
        this.activeCategory = product.category;
        this.sizesText = (product.sizes || []).join(', ');
        this.newVariant = this.createEmptyVariant(product.id, product.colour);
        this.isCreatingProduct = false;
        this.resetUploadForm();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Selected product could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // Create product
  // Opens an empty product form under the selected category.
  // Product images are uploaded after the product is saved.
  // ===============================
  createProduct(): void {
    this.selectedProduct = this.createEmptyProduct(this.activeCategory);
    this.sizesText = '';
    this.newVariant = this.createEmptyVariant();
    this.isCreatingProduct = true;
    this.resetUploadForm();
    this.clearMessages();
  }

  // ===============================
  // Save product
  // Creates or updates product details.
  // Display order is not edited by admin.
  // ===============================
  saveProduct(): void {
    if (!this.selectedProduct)
      return;

    this.clearMessages();

    const request = this.buildProductRequest(this.selectedProduct);

    const saveRequest = this.isCreatingProduct
      ? this.productCatalogService.createProduct(request)
      : this.productCatalogService.updateProduct(
          this.selectedProduct.id,
          request as UpdateProductRequest
        );

    saveRequest.subscribe({
      next: product => {
        this.successMessage = this.isCreatingProduct
          ? 'Product has been created successfully. You can now upload images.'
          : 'Product has been updated successfully.';

        this.isCreatingProduct = false;
        this.selectedProduct = structuredClone(product);
        this.activeCategory = product.category;
        this.sizesText = (product.sizes || []).join(', ');
        this.loadData(product.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Product could not be saved.';
      }
    });
  }

  // ===============================
  // Delete product
  // Removes the product from the backend catalogue.
  // ===============================
  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?'))
      return;

    this.clearMessages();

    this.productCatalogService.deleteProduct(productId).subscribe({
      next: () => {
        this.successMessage = 'Product has been deleted successfully.';
        this.selectedProduct = null;
        this.isCreatingProduct = false;
        this.loadData();
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Product could not be deleted.';
      }
    });
  }

  // ===============================
  // Add variant
  // Adds a new size, colour, SKU, and stock row to the selected product.
  // ===============================
  addVariant(): void {
    if (!this.selectedProduct || this.isCreatingProduct)
      return;

    this.clearMessages();

    const request: CreateProductVariantRequest = {
      size: this.newVariant.size,
      colour: this.newVariant.colour,
      sku: this.newVariant.sku,
      stockQuantity: this.newVariant.stockQuantity,
      isActive: this.newVariant.isActive
    };

    this.productCatalogService.createVariant(this.selectedProduct.id, request).subscribe({
      next: () => {
        this.successMessage = 'Variant has been added successfully.';
        this.newVariant = this.createEmptyVariant(this.selectedProduct?.id || 0, this.selectedProduct?.colour || '');
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Variant could not be added.';
      }
    });
  }

  // ===============================
  // Save variant
  // Updates one existing variant.
  // ===============================
  saveVariant(variant: ProductCatalogVariant): void {
    if (!variant.id)
      return;

    this.clearMessages();

    const request: UpdateProductVariantRequest = {
      size: variant.size,
      colour: variant.colour,
      sku: variant.sku,
      stockQuantity: variant.stockQuantity,
      isActive: variant.isActive
    };

    this.productCatalogService.updateVariant(variant.id, request).subscribe({
      next: () => {
        this.successMessage = 'Variant has been updated successfully.';
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Variant could not be updated.';
      }
    });
  }

  // ===============================
  // Delete variant
  // Removes one product variant.
  // ===============================
  deleteVariant(variantId: number): void {
    if (!confirm('Are you sure you want to delete this variant?'))
      return;

    this.clearMessages();

    this.productCatalogService.deleteVariant(variantId).subscribe({
      next: () => {
        this.successMessage = 'Variant has been deleted successfully.';
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Variant could not be deleted.';
      }
    });
  }

  // ===============================
  // Select image file
  // Stores the uploaded file before sending it to the API.
  // ===============================
  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedImageFile = file || null;
  }

  // ===============================
  // Upload image
  // Uploads a file from the admin device.
  // Admin does not type or edit image URLs.
  // ===============================
  uploadImage(): void {
    if (!this.selectedProduct || !this.selectedImageFile || this.isCreatingProduct)
      return;

    this.clearMessages();

    this.productCatalogService.uploadProductImage(
      this.selectedProduct.id,
      this.selectedImageFile,
      this.uploadImageAlt || this.selectedProduct.name,
      this.uploadAsMain
    ).subscribe({
      next: () => {
        this.successMessage = 'Image has been uploaded successfully.';
        this.resetUploadForm();
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Image could not be uploaded.';
      }
    });
  }

  // ===============================
  // Save image
  // Updates image alt text and main image flag only.
  // Image display order is not edited by admin.
  // ===============================
  saveImage(image: ProductCatalogImage): void {
    if (!image.id)
      return;

    this.clearMessages();

    const request: UpdateProductImageRequest = {
      imageAlt: image.imageAlt,
      isMain: image.isMain
    };

    this.productCatalogService.updateImage(image.id, request).subscribe({
      next: () => {
        this.successMessage = 'Image details have been updated successfully.';
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Image details could not be updated.';
      }
    });
  }

  // ===============================
  // Set main image
  // Makes one image the public product card image.
  // ===============================
  setMainImage(imageId?: number): void {
    if (!imageId)
      return;

    this.clearMessages();

    this.productCatalogService.setMainImage(imageId).subscribe({
      next: () => {
        this.successMessage = 'Main image has been updated successfully.';
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Main image could not be updated.';
      }
    });
  }

  // ===============================
  // Delete image
  // Removes a product image.
  // ===============================
  deleteImage(imageId?: number): void {
    if (!imageId)
      return;

    if (!confirm('Are you sure you want to delete this image?'))
      return;

    this.clearMessages();

    this.productCatalogService.deleteImage(imageId).subscribe({
      next: () => {
        this.successMessage = 'Image has been deleted successfully.';
        this.loadSelectedProduct(this.selectedProduct!.id);
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'Image could not be deleted.';
      }
    });
  }

  closeEditor(): void {
    this.selectedProduct = null;
    this.isCreatingProduct = false;
    this.resetUploadForm();
    this.clearMessages();
  }

  get visibleCategories(): ProductCatalogCategory[] {
    if (this.categories.length > 0)
      return this.categories;

    return this.fallbackCategories.map((category, index) => ({
      id: index + 1,
      name: category,
      description: '',
      imageUrl: '',
      imageAlt: '',
      displayOrder: index + 1,
      showInNavbar: true,
      isActive: true
    }));
  }

  get activeCategoryProducts(): ProductCatalogItem[] {
    return this.products.filter(product => product.category === this.activeCategory);
  }

  get activeCategoryCount(): number {
    return this.activeCategoryProducts.length;
  }

  get selectedProductVariants(): ProductCatalogVariant[] {
    return this.selectedProduct?.variants || [];
  }

  get selectedProductImages(): ProductCatalogImage[] {
    return this.selectedProduct?.images || [];
  }

  get editorTitle(): string {
    if (!this.selectedProduct)
      return '';

    return this.isCreatingProduct ? `Add ${this.activeCategory} Product` : this.selectedProduct.name;
  }

  getCategoryProductCount(category: ProductCategory): number {
    return this.products.filter(product => product.category === category).length;
  }

  trackByProductId(index: number, product: ProductCatalogItem): number {
    return product.id;
  }

  trackByCategoryId(index: number, category: ProductCatalogCategory): number {
    return category.id;
  }

  trackByVariantId(index: number, variant: ProductCatalogVariant): number {
    return variant.id;
  }

  trackByImageId(index: number, image: ProductCatalogImage): number {
    return image.id;
  }

  private createEmptyProduct(category: ProductCategory): ProductCatalogItem {
    return {
      id: 0,
      name: '',
      category,
      fitType: '',
      description: '',
      price: 0,
      priceText: 'R0',
      colour: '',
      badge: '',
      imageUrl: '',
      imageAlt: '',
      sizes: [],
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
      totalStock: 0,
      images: [],
      variants: []
    };
  }

  private createEmptyVariant(productId = 0, colour = ''): ProductCatalogVariant {
    return {
      id: 0,
      productId,
      colour,
      size: '',
      stockQuantity: 0,
      sku: '',
      isActive: true
    };
  }

  private buildProductRequest(product: ProductCatalogItem): CreateProductRequest {
    return {
      name: product.name,
      category: product.category as ProductCategory,
      fitType: product.fitType,
      description: product.description || '',
      price: product.price,
      colour: product.colour,
      badge: product.badge,
      sizes: this.parseSizes(),
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
      isActive: product.isActive
    };
  }

  private parseSizes(): string[] {
    return this.sizesText
      .split(',')
      .map(size => size.trim())
      .filter(size => size.length > 0);
  }

  private resetUploadForm(): void {
    this.selectedImageFile = null;
    this.uploadImageAlt = '';
    this.uploadAsMain = false;
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}