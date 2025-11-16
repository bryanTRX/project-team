import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

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

  get donationAmounts(): DonationAmount[] {
    return [
      {
        value: 10,
        label: '$10',
        impact:
          this.languageService.getTranslation('emergency_food_supplies') ||
          'Emergency food supplies',
        icon: 'utensils',
      },
      {
        value: 25,
        label: '$25',
        impact:
          this.languageService.getTranslation('meals_family_day') || 'Meals for a family for a day',
        icon: 'home',
      },
      {
        value: 50,
        label: '$50',
        impact:
          this.languageService.getTranslation('night_safe_shelter') || '1 night of safe shelter',
        icon: 'bed',
      },
      {
        value: 100,
        label: '$100',
        impact: this.languageService.getTranslation('therapy_session') || '1 therapy session',
        icon: 'heart',
      },
      {
        value: 250,
        label: '$250',
        impact:
          this.languageService.getTranslation('legal_aid_consultation') || 'Legal aid consultation',
        icon: 'balance-scale',
      },
    ];
  }

  get impactDetails(): { [key: number]: ImpactDetail } {
    return {
      10: {
        amount: 10,
        title:
          this.languageService.getTranslation('emergency_food_supplies') ||
          'Emergency Food Supplies',
        description:
          this.languageService.getTranslation('provides_essential_nutrition') ||
          'Provides essential nutrition for families in crisis',
        icon: 'utensils',
      },
      25: {
        amount: 25,
        title: this.languageService.getTranslation('daily_meals') || 'Daily Meals',
        description:
          this.languageService.getTranslation('feeds_family_full_day') ||
          'Feeds a family of 4 for one full day',
        icon: 'home',
      },
      50: {
        amount: 50,
        title: this.languageService.getTranslation('safe_shelter') || 'Safe Shelter',
        description:
          this.languageService.getTranslation('one_night_secure_housing') ||
          'One night of secure housing for a family',
        icon: 'bed',
      },
      100: {
        amount: 100,
        title: this.languageService.getTranslation('therapy_session') || 'Therapy Session',
        description:
          this.languageService.getTranslation('counseling_trauma_recovery') ||
          'One-on-one counseling for trauma recovery',
        icon: 'heart',
      },
      250: {
        amount: 250,
        title: this.languageService.getTranslation('legal_aid') || 'Legal Aid',
        description:
          this.languageService.getTranslation('professional_legal_consultation') ||
          'Professional consultation for legal protection',
        icon: 'balance-scale',
      },
    };
  }

  get paymentFrequencies() {
    return [
      {
        value: 'one-time',
        label: this.languageService.getTranslation('one_time') || 'One-Time',
        icon: 'bolt',
        description: this.languageService.getTranslation('single_donation') || 'Single donation',
      },
      {
        value: 'monthly',
        label: this.languageService.getTranslation('monthly') || 'Monthly',
        icon: 'sync',
        description:
          this.languageService.getTranslation('recurring_monthly') || 'Recurring monthly',
      },
      {
        value: 'quarterly',
        label: this.languageService.getTranslation('quarterly') || 'Quarterly',
        icon: 'calendar-alt',
        description: this.languageService.getTranslation('every_3_months') || 'Every 3 months',
      },
    ];
  }

  get paymentMethods() {
    return [
      {
        value: 'credit-card',
        label: this.languageService.getTranslation('credit_debit_card') || 'Credit Card',
        icon: 'credit-card',
        logo: 'cc-visa',
      },
      { value: 'paypal', label: 'PayPal', icon: 'paypal', logo: 'paypal' },
      {
        value: 'bank-transfer',
        label: this.languageService.getTranslation('bank_transfer') || 'Bank Transfer',
        icon: 'university',
        logo: 'bank',
      },
    ];
  }

  constructor(
    private router: Router,
    public languageService: LanguageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.name || '';
        this.userEmail = user.email || '';
        this.userProfileImage = user.profileImage || '';
        this.hasRecurringDonation = user.hasRecurringDonation || false;

        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const localUser = JSON.parse(savedUser);
          if (localUser.recurringAmount) this.currentRecurringAmount = localUser.recurringAmount;
          if (localUser.nextBillingDate) this.nextBillingDate = localUser.nextBillingDate;
        }
      }
    } else {
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

  async login(): Promise<void> {
    if (!this.loginPassword) {
      alert(
        this.languageService.getTranslation('alert_enter_password') || 'Please enter your password',
      );
      return;
    }

    try {
      const authenticated = await this.authService.login(this.userEmail, this.loginPassword);
      if (authenticated) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.isLoggedIn = true;
          this.userName = user.name || '';
          this.userEmail = user.email || '';
          this.userProfileImage = user.profileImage || '';
          this.hasRecurringDonation = user.hasRecurringDonation || false;
          this.showLoginForm = false;
          this.loginPassword = '';
        }
      } else {
        alert(
          this.languageService.getTranslation('invalid_credentials') || 'Invalid email or password',
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(
        this.languageService.getTranslation('login_failed') || 'Login failed. Please try again.',
      );
    }
  }

  async signup(): Promise<void> {
    if (!this.signupName || !this.signupPassword) {
      alert(
        this.languageService.getTranslation('alert_fill_required_fields') ||
          'Please fill in all required fields',
      );
      return;
    }

    if (this.signupPassword !== this.signupConfirmPassword) {
      alert(
        this.languageService.getTranslation('passwords_do_not_match') || 'Passwords do not match',
      );
      return;
    }

    if (this.signupPassword.length < 6) {
      alert(
        this.languageService.getTranslation('password_min_length') ||
          'Password must be at least 6 characters',
      );
      return;
    }

    try {
      const profile = await this.authService.signup(
        this.userEmail,
        this.signupName,
        this.signupPassword,
      );

      if (profile) {
        this.isLoggedIn = true;
        this.userName = profile.name || this.signupName;
        this.userEmail = profile.email || this.userEmail;
        this.userProfileImage = profile.profileImage || '';
        this.hasRecurringDonation = profile.hasRecurringDonation || false;
        this.showSignupForm = false;
        this.signupName = '';
        this.signupPassword = '';
        this.signupConfirmPassword = '';
        this.emailForCheck = '';

        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            name: this.userName,
            email: this.userEmail,
            profileImage: this.userProfileImage,
            hasRecurringDonation: this.hasRecurringDonation,
          }),
        );
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error?.error?.message) {
        alert(error.error.message);
      } else if (error?.status === 409) {
        alert(
          this.languageService.getTranslation('user_already_exists') ||
            'User with this email already exists. Please log in instead.',
        );
      } else {
        alert(
          this.languageService.getTranslation('signup_failed') ||
            'Failed to create account. Please try again.',
        );
      }
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

  getSelectedImpact(): ImpactDetail | null {
    const amount = this.getDonationAmount();
    if (amount in this.impactDetails) {
      return this.impactDetails[amount];
    }
    return null;
  }

  modifyRecurringDonation(): void {
    alert(
      this.languageService.getTranslation('redirecting_recurring_settings') ||
        'Redirecting to recurring donation settings...',
    );
  }

  proceedToPayment(): void {
    if (!this.isLoggedIn) {
      alert(
        this.languageService.getTranslation('alert_login_required') ||
          'Please log in or create an account first',
      );
      return;
    }

    const amount = this.getDonationAmount();
    if (amount === 0) {
      alert(
        this.languageService.getTranslation('alert_select_amount') ||
          'Please select or enter a donation amount',
      );
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
