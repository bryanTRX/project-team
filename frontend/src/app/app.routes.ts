import { Routes } from '@angular/router';
import { PaymentComponent } from '../components/payment/payment.component';
import { HomeComponent } from './home.component';
import { DonationPageComponent } from '../components/donation-page/donation-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'donate',
    component: DonationPageComponent
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
