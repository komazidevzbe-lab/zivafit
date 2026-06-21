import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductCatalogCategory,
  ProductCatalogImage,
  ProductCatalogItem,
  ProductCatalogParams,
  ProductCategory,
  UpdateProductImageRequest,
  UpdateProductRequest,
  UpdateProductVariantRequest
} from '../_models/product-catalog';

@Injectable({
  providedIn: 'root'
})
export class ProductCatalogService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  products = signal<ProductCatalogItem[]>([]);
  categories = signal<ProductCatalogCategory[]>([]);

  // ===============================
  // Load public products
  // Used by Shop, New In, category pages, Home, Product Details, Cart, and Wishlist.
  // ===============================
  loadProducts(params: ProductCatalogParams = {}) {
    return this.http.get<ProductCatalogItem[]>(this.baseUrl + 'products', {
      params: this.buildParams(params)
    }).pipe(
      map(products => products.map(product => this.normaliseProduct(product))),
      tap(products => this.products.set(products))
    );
  }

  // ===============================
  // Get public product by ID
  // Used by Product Details route /product-details/:id.
  // ===============================
  getProductByIdFromApi(productId: number) {
    return this.http.get<ProductCatalogItem>(this.baseUrl + `products/${productId}`).pipe(
      map(product => this.normaliseProduct(product)),
      tap(product => this.mergeProducts([product]))
    );
  }

  // ===============================
  // Get products from signal
  // Used by cart and wishlist when products have already been loaded.
  // ===============================
  getProductById(productId: number): ProductCatalogItem | undefined {
    return this.products().find(product => product.id === productId);
  }

  // ===============================
  // Get products by category
  // Used by Leggings, Sports Bras, Tops, Sets, Shorts, and Accessories pages.
  // ===============================
  getProductsByCategory(category: ProductCategory | string) {
    return this.loadProducts({ category });
  }

  // ===============================
  // Get new products
  // Used by New In page.
  // ===============================
  getNewProducts() {
    return this.http.get<ProductCatalogItem[]>(this.baseUrl + 'products/new').pipe(
      map(products => products.map(product => this.normaliseProduct(product))),
      tap(products => this.mergeProducts(products))
    );
  }

  // ===============================
  // Get best sellers
  // Used by Home best seller section.
  // ===============================
  getBestSellers() {
    return this.http.get<ProductCatalogItem[]>(this.baseUrl + 'products/best-sellers').pipe(
      map(products => products.map(product => this.normaliseProduct(product))),
      tap(products => this.mergeProducts(products))
    );
  }

  // ===============================
  // Get featured products
  // Used by featured product sections.
  // ===============================
  getFeaturedProducts() {
    return this.http.get<ProductCatalogItem[]>(this.baseUrl + 'products/featured').pipe(
      map(products => products.map(product => this.normaliseProduct(product))),
      tap(products => this.mergeProducts(products))
    );
  }

  // ===============================
  // Load public categories
  // Used by public catalogue/category areas.
  // ===============================
  loadCategories() {
    return this.http.get<ProductCatalogCategory[]>(this.baseUrl + 'products/categories').pipe(
      map(categories => categories.map(category => this.normaliseCategory(category))),
      tap(categories => this.categories.set(categories))
    );
  }

  // ===============================
  // Load admin products
  // Admin receives active and inactive products.
  // ===============================
  loadAdminProducts(params: ProductCatalogParams = {}) {
    return this.http.get<ProductCatalogItem[]>(this.baseUrl + 'adminproducts', {
      params: this.buildParams(params)
    }).pipe(
      map(products => products.map(product => this.normaliseProduct(product))),
      tap(products => this.products.set(products))
    );
  }

  // ===============================
  // Load admin product by ID
  // Used after saving images or variants to refresh the selected product.
  // ===============================
  getAdminProduct(productId: number) {
    return this.http.get<ProductCatalogItem>(this.baseUrl + `adminproducts/${productId}`).pipe(
      map(product => this.normaliseProduct(product)),
      tap(product => this.mergeProducts([product]))
    );
  }

  // ===============================
  // Load admin categories
  // Used by product admin forms.
  // ===============================
  loadAdminCategories() {
    return this.http.get<ProductCatalogCategory[]>(this.baseUrl + 'adminproducts/categories').pipe(
      map(categories => categories.map(category => this.normaliseCategory(category))),
      tap(categories => this.categories.set(categories))
    );
  }

  // ===============================
  // Create product
  // Admin creates products that appear on the public website.
  // Images are uploaded separately from the Images tab.
  // ===============================
  createProduct(model: CreateProductRequest) {
    return this.http.post<ProductCatalogItem>(this.baseUrl + 'adminproducts', model).pipe(
      map(product => this.normaliseProduct(product)),
      tap(product => this.mergeProducts([product]))
    );
  }

  // ===============================
  // Update product
  // Admin updates existing product data in the database.
  // Product image URLs are not edited here.
  // ===============================
  updateProduct(productId: number, model: UpdateProductRequest) {
    return this.http.put<ProductCatalogItem>(this.baseUrl + `adminproducts/${productId}`, model).pipe(
      map(product => this.normaliseProduct(product)),
      tap(product => this.mergeProducts([product]))
    );
  }

  // ===============================
  // Delete product
  // Admin removes a product from the database.
  // ===============================
  deleteProduct(productId: number) {
    return this.http.delete<{ message: string }>(this.baseUrl + `adminproducts/${productId}`).pipe(
      tap(() => {
        this.products.set(this.products().filter(product => product.id !== productId));
      })
    );
  }

  // ===============================
  // Create variant
  // Adds size, colour, stock, and SKU to a product.
  // ===============================
  createVariant(productId: number, model: CreateProductVariantRequest) {
    return this.http.post(this.baseUrl + `adminproducts/${productId}/variants`, model);
  }

  // ===============================
  // Update variant
  // Updates stock/variant data.
  // ===============================
  updateVariant(variantId: number, model: UpdateProductVariantRequest) {
    return this.http.put(this.baseUrl + `adminproducts/variants/${variantId}`, model);
  }

  // ===============================
  // Delete variant
  // Removes one product variant.
  // ===============================
  deleteVariant(variantId: number) {
    return this.http.delete<{ message: string }>(this.baseUrl + `adminproducts/variants/${variantId}`);
  }

  // ===============================
  // Upload product image
  // Uploads an image file and attaches it to the product.
  // Admin never types an image URL manually.
  // ===============================
  uploadProductImage(productId: number, file: File, imageAlt: string, isMain: boolean) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('imageAlt', imageAlt);
    formData.append('isMain', String(isMain));

    return this.http.post<ProductCatalogImage>(
      this.baseUrl + `adminproducts/${productId}/images/upload`,
      formData
    ).pipe(
      map(image => this.normaliseImage(image))
    );
  }

  // ===============================
  // Update image
  // Updates alt text, display order, and main image flag.
  // The stored image URL is not editable from admin.
  // ===============================
  updateImage(imageId: number, model: UpdateProductImageRequest) {
    return this.http.put<ProductCatalogImage>(this.baseUrl + `adminproducts/images/${imageId}`, model).pipe(
      map(image => this.normaliseImage(image))
    );
  }

  // ===============================
  // Set main image
  // Makes one product image the main product card image.
  // ===============================
  setMainImage(imageId: number) {
    return this.http.put<ProductCatalogImage>(this.baseUrl + `adminproducts/images/${imageId}/main`, {}).pipe(
      map(image => this.normaliseImage(image))
    );
  }

  // ===============================
  // Delete image
  // Removes one product image.
  // ===============================
  deleteImage(imageId: number) {
    return this.http.delete<{ message: string }>(this.baseUrl + `adminproducts/images/${imageId}`);
  }

  private buildParams(params: ProductCatalogParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.category)
      httpParams = httpParams.set('category', params.category);

    if (params.search)
      httpParams = httpParams.set('search', params.search);

    if (params.sort)
      httpParams = httpParams.set('sort', params.sort);

    if (params.isNew !== undefined)
      httpParams = httpParams.set('isNew', String(params.isNew));

    if (params.isBestSeller !== undefined)
      httpParams = httpParams.set('isBestSeller', String(params.isBestSeller));

    if (params.isFeatured !== undefined)
      httpParams = httpParams.set('isFeatured', String(params.isFeatured));

    return httpParams;
  }

  private mergeProducts(products: ProductCatalogItem[]): void {
    const existingProducts = this.products();
    const mergedProducts = [...existingProducts];

    for (const product of products) {
      const index = mergedProducts.findIndex(item => item.id === product.id);

      if (index >= 0) {
        mergedProducts[index] = product;
      } else {
        mergedProducts.push(product);
      }
    }

    this.products.set(mergedProducts);
  }

  private normaliseProduct(product: ProductCatalogItem): ProductCatalogItem {
    const images = (product.images || []).map(image => this.normaliseImage(image));
    const mainImage = images.find(image => image.isMain) || images[0];

    return {
      ...product,
      description: product.description || '',
      badge: product.badge || '',
      priceText: product.priceText || this.formatPrice(product.price),
      imageUrl: this.normaliseImageUrl(product.imageUrl || mainImage?.imageUrl || ''),
      imageAlt: product.imageAlt || mainImage?.imageAlt || product.name,
      sizes: product.sizes || [],
      images,
      variants: product.variants || []
    };
  }

  private normaliseCategory(category: ProductCatalogCategory): ProductCatalogCategory {
    return {
      ...category,
      imageUrl: this.normaliseImageUrl(category.imageUrl)
    };
  }

  private normaliseImage(image: ProductCatalogImage): ProductCatalogImage {
    return {
      ...image,
      imageUrl: this.normaliseImageUrl(image.imageUrl)
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

  private formatPrice(price: number): string {
    return `R${price.toLocaleString('en-ZA', {
      maximumFractionDigits: 0
    }).replace(/,/g, ' ')}`;
  }
}