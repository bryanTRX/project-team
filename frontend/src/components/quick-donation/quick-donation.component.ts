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
  styleUrl: './quick-donation.component.scss',
})
export class QuickDonationComponent implements OnInit, OnDestroy {
  selectedAmount: number | null = null;
  customAmount: number | null = null;
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  donationAmounts = [100, 250, 500, 1000];

  constructor(
    public languageService: LanguageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  getAmountDescription(amount: number): string {
    switch (amount) {
      case 100:
        return this.languageService.getTranslation('therapy_session') || '1 therapy session';
      case 250:
        return this.languageService.getTranslation('legal_aid_consultation') || 'Legal aid consultation';
      case 500:
        return this.languageService.getTranslation('week_counseling_support') || '1 week of counseling support';
      case 1000:
        return this.languageService.getTranslation('month_safe_shelter') || '1 month of safe shelter';
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
      localStorage.setItem('donationAmount', amount.toString());
      localStorage.setItem('recurringOption', 'one-time');
      this.router.navigate(['/payment']).then(() => {
        setTimeout(() => {
          const contactInfoSection = document.getElementById('contact-information');
          if (contactInfoSection) {
            const navbarHeight = 80;
            const elementPosition = contactInfoSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      });
    } else {
      alert(this.languageService.getTranslation('alert_select_amount'));
    }
  }
}
