import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-quick-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-donation.component.html',
  styleUrl: './quick-donation.component.scss'
})
export class QuickDonationComponent {
  selectedAmount: number | null = null;
  customAmount: number | null = null;
  recurringOption: string = 'one-time';

  donationAmounts = [25, 50, 100, 200];
  recurringOptions = [
    { value: 'one-time', label: 'One-Time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  constructor(public languageService: LanguageService, private router: Router) {}

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
      
      // Redirect to payment page using router
      this.router.navigate(['/payment']);
    } else {
      alert('Please select or enter a donation amount');
    }
  }
}

