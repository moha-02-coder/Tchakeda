// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then((c) => c.DashAnalyticsComponent)
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'demo/admin-page/buildings',
        loadChildren: () => import('./demo/admin-page/buildings/buildings.module').then(m => m.BuildingsModule)
      },
      {
        path: 'demo/admin-page/owners',
        loadChildren: () => import('./demo/admin-page/owners/owners.module').then(m => m.OwnersModule)
      },
      {
        path: 'demo/admin-page/owners/payments',
        loadComponent: () => import('./demo/admin-page/owners/owners-payments.component').then(c => c.OwnersPaymentsComponent)
      },
      {
        path: 'demo/admin-page/tenants',
        loadChildren: () => import('./demo/admin-page/tenants/tenants.module').then(m => m.TenantsModule)
      },
      {
        path: 'demo/admin-page/apartments',
        loadChildren: () => import('./demo/admin-page/apartments/apartments.module').then(m => m.ApartmentsModule)
      },
      {
        path: 'demo/admin-page/rentals',
        loadChildren: () => import('./demo/admin-page/rentals/rentals.module').then(m => m.RentalsModule)
      },
      {
        path: 'demo/admin-page/recoveries',
        loadChildren: () => import('./demo/admin-page/recoveries/recoveries.module').then(m => m.RecoveriesModule)
      },
      {
        path: 'demo/admin-page/recoveries/payments',
        loadComponent: () => import('./demo/admin-page/recoveries/recoveries-payments.component').then(c => c.RecoveriePaymentsComponent)
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component').then((c) => c.SignUpComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component').then((c) => c.SignInComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
