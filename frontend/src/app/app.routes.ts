import { Routes } from '@angular/router';
import { PaymentComponent } from '../components/payment/payment.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
