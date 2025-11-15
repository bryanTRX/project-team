import { Routes } from '@angular/router';
import { PaymentComponent } from '../components/payment/payment.component';
import { HomeComponent } from './home.component';
import { UserDashboardComponent } from '../components/user-dashboard/user-dashboard.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
