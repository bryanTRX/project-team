import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quick-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-donation.component.html',
  styleUrl: './quick-donation.component.scss'
})
export class QuickDonationComponent implements OnInit, OnDestroy {
  selectedAmount: number | null = null;
  customAmount: number | null = null;
  recurringOption: string = 'one-time';
  private languageSubscription?: Subscription;
  currentLanguage: string = 'en';

  donationAmounts = [25, 50, 100, 200];
  
  get recurringOptions() {
    return [
      { value: 'one-time', label: this.languageService.getTranslation('one_time') },
      { value: 'monthly', label: this.languageService.getTranslation('monthly') },
      { value: 'quarterly', label: this.languageService.getTranslation('quarterly') },
      { value: 'yearly', label: this.languageService.getTranslation('yearly') }
    ];
  }

  constructor(public languageService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
  
  getAmountDescription(amount: number): string {
    switch(amount) {
      case 25:
        return this.languageService.getTranslation('amount_25_description');
      case 50:
        return this.languageService.getTranslation('amount_50_description');
      case 100:
        return this.languageService.getTranslation('amount_100_description');
      case 200:
        return this.languageService.getTranslation('amount_200_description');
      default:
        return '';
    }
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = null;
  }

  selectCustomAmount(): void {
    this.selectedAmount = null;
    this.customAmount = 0;
  }

  onCustomAmountChange(value: string): void {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      this.customAmount = amount;
      this.selectedAmount = null;
    } else if (value === '' || value === '0') {
      this.customAmount = 0;
    }
  }

  getDonationAmount(): number {
    if (this.customAmount !== null && this.customAmount > 0) {
      return this.customAmount;
    }
    return this.selectedAmount || 0;
  }

  proceedToPayment(): void {
    const amount = this.getDonationAmount();
    if (amount > 0) {
      // Save donation details to localStorage
      localStorage.setItem('donationAmount', amount.toString());
      localStorage.setItem('recurringOption', this.recurringOption);
      
      // Redirect to donation page (which handles auth flow)
      this.router.navigate(['/donate']);
    } else {
      alert(this.languageService.getTranslation('alert_select_amount'));
    }
  }
}

