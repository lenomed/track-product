import { Routes } from '@angular/router';
import { LayoutComponent } from './user/layout/layout';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./user/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'track-item',
        loadComponent: () =>
          import('./user/track-item/track-item.component').then(
            (m) => m.TrackItemComponent
          ),
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./user/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./user/services/services.component').then(
            (m) => m.ServicesComponent
          ),
      },

      {
        path: 'services/detail',
        loadComponent: () =>
          import('./user/services/detail/detail.component').then(
            (m) => m.DetailComponent
          ),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./user/pricing/pricing.component').then(
            (m) => m.PricingComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./user/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },

      {
        path: 'tracking/:id',
        loadComponent: () =>
          import('./user/product/tracking-result.component').then(
            (m) => m.ProductTrackingResultComponent
          ),
      },

      {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./admin/admin.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
    ],
  },

  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/login/login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
