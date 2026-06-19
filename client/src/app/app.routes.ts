import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { NewInComponent } from './pages/new-in/new-in.component';
import { ShopComponent } from './pages/shop/shop.component';
import { LeggingsComponent } from './pages/leggings/leggings.component';
import { SportsBrasComponent } from './pages/sports-bras/sports-bras.component';
import { TopsComponent } from './pages/tops/tops.component';
import { SetsComponent } from './pages/sets/sets.component';
import { ShortsComponent } from './pages/shorts/shorts.component';
import { AccessoriesComponent } from './pages/accessories/accessories.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { SavedAddressesComponent } from './pages/saved-addresses/saved-addresses.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminStorefrontContentComponent } from './admin/admin-storefront-content/admin-storefront-content.component';
import { AdminProductCatalogComponent } from './admin/admin-product-catalog/admin-product-catalog.component';
import { AdminOrderManagementComponent } from './admin/admin-order-management/admin-order-management.component';
import { AdminCustomerManagementComponent } from './admin/admin-customer-management/admin-customer-management.component';
import { AdminReviewManagementComponent } from './admin/admin-review-management/admin-review-management.component';
import { AdminNewsletterManagementComponent } from './admin/admin-newsletter-management/admin-newsletter-management.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';

import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';

import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },

      { path: 'new-in', component: NewInComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'leggings', component: LeggingsComponent },
      { path: 'sports-bras', component: SportsBrasComponent },
      { path: 'tops', component: TopsComponent },
      { path: 'sets', component: SetsComponent },
      { path: 'shorts', component: ShortsComponent },
      { path: 'accessories', component: AccessoriesComponent },
      { path: 'product-details/:id', component: ProductDetailsComponent },

      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
      { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [authGuard] },
      { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },
      { path: 'order-details', component: OrderDetailsComponent, canActivate: [authGuard] },
      { path: 'my-account', component: MyAccountComponent, canActivate: [authGuard] },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
      { path: 'saved-addresses', component: SavedAddressesComponent, canActivate: [authGuard] },

      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },

      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'test-errors', component: TestErrorsComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },

      { path: 'storefront-content', component: AdminStorefrontContentComponent },
      { path: 'product-catalog', component: AdminProductCatalogComponent },

      { path: 'order-management', component: AdminOrderManagementComponent },
      { path: 'customer-management', component: AdminCustomerManagementComponent },
      { path: 'review-management', component: AdminReviewManagementComponent },
      { path: 'newsletter-management', component: AdminNewsletterManagementComponent },
      { path: 'settings', component: AdminSettingsComponent },

      { path: 'home-management', redirectTo: 'storefront-content', pathMatch: 'full' },
      { path: 'product-management', redirectTo: 'product-catalog', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];