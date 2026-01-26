import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MyStationsComponent } from './features/stations/my-stations/my-stations.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'validate-email',
    loadComponent: () =>
      import('./features/auth/email-validation/email-validation.component').then(
        (m) => m.EmailValidationComponent,
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard], // Route pour le dashboard owner
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.OwnerDashboardComponent,
      ),
  },
  {
    path: 'stations',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/stations/station-list/station-list.component').then(
            (m) => m.StationListComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/stations/add-station/add-station.component').then(
            (m) => m.AddStationComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/stations/station-detail/station-detail.component').then(
            (m) => m.StationDetailComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/stations/station-form/station-form.component').then(
            (m) => m.StationFormComponent,
          ),
      },
    ],
  },
  {
    path: 'my-stations',
    component: MyStationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/bookings/booking-list/booking-list.component').then(
            (m) => m.BookingListComponent,
          ),
      },
      {
        path: 'new/:stationId',
        loadComponent: () =>
          import('./features/bookings/booking-form/booking-form.component').then(
            (m) => m.BookingFormComponent,
          ),
      },
      {
        path: 'payment/:bookingId',
        loadComponent: () =>
          import('./features/bookings/booking-payment/booking-payment.component').then(
            (m) => m.BookingPaymentComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
