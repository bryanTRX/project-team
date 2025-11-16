import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

interface DonationAmount {
  value: number;
  label: string;
  impact: string;
  icon: string;
}

interface ImpactDetail {
  amount: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-donation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './donation-page.component.html',
  styleUrl: './donation-page.component.scss',
})
export class DonationPageComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userEmail = '';
  userProfileImage = '';
  checkingEmail = false;
  emailForCheck = '';
  showLoginForm = false;
  showSignupForm = false;
  loginPassword = '';
  forgotPassword = false;
  signupName = '';
  signupPassword = '';
  signupConfirmPassword = '';
  selectedAmount: number | null = null;
  customAmount: number | null = null;
  paymentFrequency: string = 'one-time';
  paymentMethod: string = 'credit-card';
  largeText = false;
  agreeToUpdates = false;
  currentRecurringAmount = 50;
  nextBillingDate = '2024-02-15';
  hasRecurringDonation = false;

  donationAmounts: DonationAmount[] = [
    { value: 10, label: '$10', impact: 'Emergency food supplies', icon: 'utensils' },
    { value: 25, label: '$25', impact: 'Meals for a family for a day', icon: 'home' },
    { value: 50, label: '$50', impact: '1 night of safe shelter', icon: 'bed' },
    { value: 100, label: '$100', impact: '1 therapy session', icon: 'heart' },
    { value: 250, label: '$250', impact: 'Legal aid consultation', icon: 'balance-scale' },
  ];

  impactDetails: { [key: number]: ImpactDetail } = {
    10: {
      amount: 10,
      title: 'Emergency Food Supplies',
      description: 'Provides essential nutrition for families in crisis',
      icon: 'utensils',
    },
    25: {
      amount: 25,
      title: 'Daily Meals',
      description: 'Feeds a family of 4 for one full day',
      icon: 'home',
    },
    50: {
      amount: 50,
      title: 'Safe Shelter',
      description: 'One night of secure housing for a family',
      icon: 'bed',
    },
    100: {
      amount: 100,
      title: 'Therapy Session',
      description: 'One-on-one counseling for trauma recovery',
      icon: 'heart',
    },
    250: {
      amount: 250,
      title: 'Legal Aid',
      description: 'Professional consultation for legal protection',
      icon: 'balance-scale',
    },
  };

  paymentFrequencies = [
    { value: 'one-time', label: 'One-Time', icon: 'bolt', description: 'Single donation' },
    { value: 'monthly', label: 'Monthly', icon: 'sync', description: 'Recurring monthly' },
    { value: 'quarterly', label: 'Quarterly', icon: 'calendar-alt', description: 'Every 3 months' },
  ];

  paymentMethods = [
    { value: 'credit-card', label: 'Credit Card', icon: 'credit-card', logo: 'cc-visa' },
    { value: 'paypal', label: 'PayPal', icon: 'paypal', logo: 'paypal' },
    { value: 'bank-transfer', label: 'Bank Transfer', icon: 'university', logo: 'bank' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.isLoggedIn = true;
      this.userName = user.name || '';
      this.userEmail = user.email || '';
      this.userProfileImage = user.profileImage || '';
      this.hasRecurringDonation = user.hasRecurringDonation || false;
      if (user.recurringAmount) this.currentRecurringAmount = user.recurringAmount;
      if (user.nextBillingDate) this.nextBillingDate = user.nextBillingDate;
    }
    const savedAmount = localStorage.getItem('donationAmount');
    if (savedAmount) {
      this.selectedAmount = parseFloat(savedAmount);
      localStorage.removeItem('donationAmount');
    }
  }


  toggleLargeText(): void {
    this.largeText = !this.largeText;
    document.body.classList.toggle('large-text-mode', this.largeText);
  }

  checkEmail(): void {
    if (!this.emailForCheck || !this.emailForCheck.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    this.checkingEmail = true;
    setTimeout(() => {
      this.checkingEmail = false;
      const existingAccounts = ['test@example.com', 'donor@example.com'];

      if (existingAccounts.includes(this.emailForCheck.toLowerCase())) {
        this.showLoginForm = true;
        this.userEmail = this.emailForCheck;
      } else {
        this.showSignupForm = true;
        this.userEmail = this.emailForCheck;
      }
    }, 1000);
  }

  login(): void {
    if (!this.loginPassword) {
      alert('Please enter your password');
      return;
    }
    const user = {
      name: 'Sarah Johnson',
      email: this.userEmail,
      profileImage: 'https://i.pravatar.cc/150?img=47',
      hasRecurringDonation: false,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.isLoggedIn = true;
    this.userName = user.name;
    this.userProfileImage = user.profileImage;
    this.showLoginForm = false;
    this.loginPassword = '';
  }

  signup(): void {
    if (!this.signupName || !this.signupPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.signupPassword !== this.signupConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.signupPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    const user = {
      name: this.signupName,
      email: this.userEmail,
      profileImage: '',
      hasRecurringDonation: false,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.isLoggedIn = true;
    this.userName = this.signupName;
    this.showSignupForm = false;
    this.signupName = '';
    this.signupPassword = '';
    this.signupConfirmPassword = '';
    this.emailForCheck = '';
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

  getSelectedImpact(): ImpactDetail | null {
    const amount = this.getDonationAmount();
    if (amount in this.impactDetails) {
      return this.impactDetails[amount];
    }
    return null;
  }

  modifyRecurringDonation(): void {
    alert('Redirecting to recurring donation settings...');
  }

  proceedToPayment(): void {
    if (!this.isLoggedIn) {
      alert('Please log in or create an account first');
      return;
    }

    const amount = this.getDonationAmount();
    if (amount === 0) {
      alert('Please select or enter a donation amount');
      return;
    }
    localStorage.setItem('donationAmount', amount.toString());
    localStorage.setItem('recurringOption', this.paymentFrequency);
    localStorage.setItem('paymentMethod', this.paymentMethod);
    localStorage.setItem('agreeToUpdates', this.agreeToUpdates.toString());
    this.router.navigate(['/payment']).then(() => {
      setTimeout(() => {
        const contactInfoSection = document.getElementById('contact-information');
        if (contactInfoSection) {
          const navbarHeight = 80;
          const elementPosition = contactInfoSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getFrequencyLabel(): string {
    const freq = this.paymentFrequencies.find((f) => f.value === this.paymentFrequency);
    return freq ? freq.label : 'One-Time';
  }

  getDonationButtonText(): string {
    const amount = this.getDonationAmount();
    const freq = this.getFrequencyLabel().toLowerCase();
    if (this.paymentFrequency === 'one-time') {
      return `Donate $${amount.toFixed(2)}`;
    }
    return `Donate $${amount.toFixed(2)} ${freq}`;
  }
}
