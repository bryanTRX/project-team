import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  donationAmount: number = 0;
  recurringOption: string = 'one-time';
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  email: string = '';
  showSuccess = false;
  
  // Accessibility
  simpleMode = false;
  largeText = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get donation amount from localStorage or route params
    const savedAmount = localStorage.getItem('donationAmount');
    const savedRecurring = localStorage.getItem('recurringOption');
    
    if (savedAmount) {
      this.donationAmount = parseFloat(savedAmount);
    }
    if (savedRecurring) {
      this.recurringOption = savedRecurring;
    }

    // Redirect if no donation amount
    if (!savedAmount || this.donationAmount === 0) {
      this.router.navigate(['/']);
    }
  }

  toggleSimpleMode(): void {
    this.simpleMode = !this.simpleMode;
  }

  toggleLargeText(): void {
    this.largeText = !this.largeText;
    document.body.classList.toggle('large-text-mode', this.largeText);
  }

  getDonationAmountText(): string {
    return `$${this.donationAmount.toFixed(2)}`;
  }

  getImpactTitle(): string {
    if (this.donationAmount >= 250) return 'Legal aid consultation';
    if (this.donationAmount >= 100) return '1 therapy session';
    if (this.donationAmount >= 50) return '1 night of safe shelter';
    if (this.donationAmount >= 25) return 'Meals for a family for a day';
    return 'Emergency food supplies';
  }

  getImpactDescription(): string {
    if (this.donationAmount >= 250) return 'Professional consultation for legal protection';
    if (this.donationAmount >= 100) return 'One-on-one counseling for trauma recovery';
    if (this.donationAmount >= 50) return 'One night of secure housing for a family';
    if (this.donationAmount >= 25) return 'Feeds a family of 4 for one full day';
    return 'Provides essential nutrition for families in crisis';
  }

  formatCardNumber(): void {
    // Remove all non-digits
    let value = this.cardNumber.replace(/\D/g, '');
    // Add spaces every 4 digits
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    // Limit to 19 characters (16 digits + 3 spaces)
    this.cardNumber = value.slice(0, 19);
  }

  formatExpiryDate(): void {
    // Remove all non-digits
    let value = this.expiryDate.replace(/\D/g, '');
    // Add slash after 2 digits
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.expiryDate = value.slice(0, 5);
  }

  formatCvv(): void {
    // Remove all non-digits and limit to 4
    this.cvv = this.cvv.replace(/\D/g, '').slice(0, 4);
  }

  onSubmit(): void {
    if (this.validateForm()) {
      // Process payment (in real app, this would call a payment API)
      console.log('Processing payment:', {
        amount: this.donationAmount,
        recurring: this.recurringOption,
        email: this.email
      });
      
      // Show success message
      this.showSuccess = true;
      
      // Redirect after 3 seconds
      setTimeout(() => {
        this.redirectToThankYou();
      }, 3000);
    }
  }

  validateForm(): boolean {
    if (!this.cardNumber || this.cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Please enter a valid card number');
      return false;
    }
    if (!this.cardHolder) {
      alert('Please enter card holder name');
      return false;
    }
    if (!this.expiryDate || !/^\d{2}\/\d{2}$/.test(this.expiryDate)) {
      alert('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!this.cvv || this.cvv.length < 3) {
      alert('Please enter a valid CVV');
      return false;
    }
    if (!this.email || !this.email.includes('@')) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  }

  getRecurringLabel(): string {
    const labels: { [key: string]: string } = {
      'one-time': 'One-Time',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'yearly': 'Yearly'
    };
    return labels[this.recurringOption] || this.recurringOption;
  }

  redirectToThankYou(): void {
    localStorage.removeItem('donationAmount');
    localStorage.removeItem('recurringOption');
    // In a real app, this would navigate to a thank you page
    this.router.navigate(['/']);
    setTimeout(() => {
      alert('Thank you for your donation! Your support makes a difference.');
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
