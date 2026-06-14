import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { PagePlaceholderComponent } from './pages/page-placeholder/page-placeholder.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

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

      {
        path: 'new-in',
        component: PagePlaceholderComponent,
        data: {
          title: 'New In',
          subtitle: 'Fresh ZivaFit activewear drops will live here soon.'
        }
      },
      {
        path: 'shop',
        component: PagePlaceholderComponent,
        data: {
          title: 'Shop',
          subtitle: 'The full ZivaFit product browsing page will be connected later.'
        }
      },
      {
        path: 'leggings',
        component: PagePlaceholderComponent,
        data: {
          title: 'Leggings',
          subtitle: 'Leggings products will be added in the product catalogue phase.'
        }
      },
      {
        path: 'sports-bras',
        component: PagePlaceholderComponent,
        data: {
          title: 'Sports Bras',
          subtitle: 'Sports bra products will be added in the product catalogue phase.'
        }
      },
      {
        path: 'tops',
        component: PagePlaceholderComponent,
        data: {
          title: 'Tops',
          subtitle: 'Tops products will be added in the product catalogue phase.'
        }
      },
      {
        path: 'sets',
        component: PagePlaceholderComponent,
        data: {
          title: 'Sets',
          subtitle: 'Matching sets will be added in the product catalogue phase.'
        }
      },
      {
        path: 'shorts',
        component: PagePlaceholderComponent,
        data: {
          title: 'Shorts',
          subtitle: 'Shorts products will be added in the product catalogue phase.'
        }
      },
      {
        path: 'accessories',
        component: PagePlaceholderComponent,
        data: {
          title: 'Accessories',
          subtitle: 'Accessories will be added in the product catalogue phase.'
        }
      },
      {
        path: 'product-details/:id',
        component: PagePlaceholderComponent,
        data: {
          title: 'Product Details',
          subtitle: 'Product details will be connected once products exist.'
        }
      },
      {
        path: 'cart',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Cart',
          subtitle: 'Please log in to view your ZivaFit cart.'
        }
      },

      {
        path: 'wishlist',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Wishlist',
          subtitle: 'Wishlist requires login and will be connected later.'
        }
      },
      {
        path: 'checkout',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Checkout',
          subtitle: 'Checkout requires login and will be built later.'
        }
      },
      {
        path: 'order-confirmation',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Order Confirmation',
          subtitle: 'Order confirmation will be connected after checkout.'
        }
      },
      {
        path: 'my-orders',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'My Orders',
          subtitle: 'Customer order history will be connected later.'
        }
      },
      {
        path: 'order-details',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Order Details',
          subtitle: 'Order details will be connected later.'
        }
      },
      {
        path: 'my-account',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'My Account',
          subtitle: 'Customer profile management will be built later.'
        }
      },
      {
        path: 'edit-profile',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Edit Profile',
          subtitle: 'Profile editing will be built later.'
        }
      },
      {
        path: 'saved-addresses',
        component: PagePlaceholderComponent,
        canActivate: [authGuard],
        data: {
          title: 'Saved Addresses',
          subtitle: 'Saved delivery addresses will be built later.'
        }
      },

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
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];