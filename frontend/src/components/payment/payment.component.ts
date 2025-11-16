import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit, OnDestroy {
  donationOptions: number[] = [25, 50, 100, 250, 500];
  donationAmount: number = this.donationOptions[1];
  customAmount: string = '';
  recurringOption: string = 'one-time';
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;
  isAuthenticated = false;

  get frequencyOptions() {
    return [
      {
        value: 'one-time',
        label: this.languageService.getTranslation('one_time'),
        description: this.languageService.getTranslation('single_donation'),
      },
      {
        value: 'monthly',
        label: this.languageService.getTranslation('monthly'),
        description: this.languageService.getTranslation('recurring_monthly'),
        highlight: this.languageService.getTranslation('most_popular'),
      },
      {
        value: 'quarterly',
        label: this.languageService.getTranslation('quarterly'),
        description: this.languageService.getTranslation('every_3_months'),
      },
      {
        value: 'yearly',
        label: this.languageService.getTranslation('yearly'),
        description: this.languageService.getTranslation('every_year'),
      },
    ];
  }

  get paymentMethods() {
    return [
      {
        value: 'card',
        label: this.languageService.getTranslation('credit_debit_card'),
        icon: 'far fa-credit-card',
        badges: [],
      },
      { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal', badges: [] },
      {
        value: 'phone',
        label: this.languageService.getTranslation('paying_by_phone'),
        icon: 'fas fa-mobile-alt',
        badges: [],
      },
    ];
  }

  get textSizeOptions() {
    return [
      { value: 'normal', label: this.languageService.getTranslation('normal') },
      { value: 'large', label: this.languageService.getTranslation('large') },
      { value: 'xlarge', label: this.languageService.getTranslation('extra_large') },
    ];
  }

  selectedPaymentMethod = 'card';
  updatesOptIn = false;
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  email: string = '';
  emailMode: 'idle' | 'existing' | 'new' = 'idle';
  loginPassword = '';
  newUsername = '';
  newPassword = '';
  emailSectionInvalid = false;
  showSuccess = false;
  showAccessibilityPanel = false;
  simpleMode = false;
  textSize: 'normal' | 'large' | 'xlarge' = 'normal';

  constructor(
    private router: Router,
    public languageService: LanguageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Get donation amount from localStorage or route params
    const savedAmount = localStorage.getItem('donationAmount');
    const savedRecurring = localStorage.getItem('recurringOption');

    if (savedAmount) {
      this.donationAmount = parseFloat(savedAmount);
      if (!this.donationOptions.includes(this.donationAmount)) {
        this.customAmount = savedAmount;
      } else {
        this.customAmount = '';
      }
    } else {
      this.customAmount = this.donationAmount.toString();
    }
    if (savedRecurring) {
      this.recurringOption = savedRecurring;
    }

    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      if (user?.email) {
        this.email = user.email;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    try {
      if (this.isAuthenticated) {
        await this.authService.recordDonation(this.donationAmount);
      }

      console.log('Processing payment:', {
        amount: this.donationAmount,
        recurring: this.recurringOption,
        email: this.email,
      });

      this.showSuccess = true;
    } catch (error) {
      console.error('Unable to complete donation', error);
      alert('Unable to complete your donation right now. Please try again in a moment.');
    }
  }

  validateForm(): boolean {
    this.emailSectionInvalid = false;
    if (!this.donationAmount || this.donationAmount <= 0) {
      alert(this.languageService.getTranslation('alert_select_amount'));
      return false;
    }
    if (!this.cardNumber || this.cardNumber.replace(/\s/g, '').length !== 16) {
      alert(
        this.languageService.getTranslation('card_number') +
          ' - ' +
          this.languageService
            .getTranslation('invalid_credentials')
            .replace('username or password', ''),
      );
      return false;
    }
    if (!this.cardHolder) {
      alert(
        this.languageService.getTranslation('card_holder_name') +
          ' - ' +
          this.languageService
            .getTranslation('invalid_credentials')
            .replace('username or password', ''),
      );
      return false;
    }
    if (!this.expiryDate || !/^\d{2}\/\d{2}$/.test(this.expiryDate)) {
      alert(
        this.languageService.getTranslation('expiry_date') +
          ' - ' +
          this.languageService
            .getTranslation('invalid_credentials')
            .replace('username or password', ''),
      );
      return false;
    }
    if (!this.cvv || this.cvv.length < 3) {
      alert(
        this.languageService.getTranslation('cvv') +
          ' - ' +
          this.languageService
            .getTranslation('invalid_credentials')
            .replace('username or password', ''),
      );
      return false;
    }
    if (!this.email || !this.email.includes('@')) {
      alert(
        this.languageService.getTranslation('email_address') +
          ' - ' +
          this.languageService
            .getTranslation('invalid_credentials')
            .replace('username or password', ''),
      );
      this.emailSectionInvalid = true;
      return false;
    }
    if (!this.isAuthenticated) {
      if (this.emailMode === 'existing' && !this.loginPassword) {
        alert(
          this.languageService.getTranslation('existing_account_password_label') +
            ' - ' +
            this.languageService
              .getTranslation('invalid_credentials')
              .replace('username or password', ''),
        );
        this.emailSectionInvalid = true;
        return false;
      }
      if (this.emailMode === 'new') {
        if (!this.newUsername) {
          alert(
            this.languageService.getTranslation('create_username_label') +
              ' - ' +
              this.languageService
                .getTranslation('invalid_credentials')
                .replace('username or password', ''),
          );
          this.emailSectionInvalid = true;
          return false;
        }
        if (!this.newPassword) {
          alert(
            this.languageService.getTranslation('create_password_label') +
              ' - ' +
              this.languageService
                .getTranslation('invalid_credentials')
                .replace('username or password', ''),
          );
          this.emailSectionInvalid = true;
          return false;
        }
      }
    }
    return true;
  }

  getRecurringLabel(): string {
    return (
      this.languageService.getTranslation(this.recurringOption.replace('-', '_') as any) ||
      this.recurringOption
    );
  }

  onCustomAmountChange(): void {
    const parsedAmount = parseFloat(this.customAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      this.donationAmount = parsedAmount;
    } else {
      this.donationAmount = 0;
    }
  }

  handleEmailInput(): void {
    const trimmed = this.email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      this.emailMode = 'idle';
      this.loginPassword = '';
      this.newUsername = '';
      this.newPassword = '';
      return;
    }
    if (this.authService.emailHasAccount(trimmed)) {
      this.emailMode = 'existing';
      this.loginPassword = '';
      this.newUsername = '';
      this.newPassword = '';
    } else {
      this.emailMode = 'new';
      this.loginPassword = '';
    }
  }

  selectDonationAmount(amount: number): void {
    this.donationAmount = amount;
    this.customAmount = amount.toString();
  }

  selectFrequency(value: string): void {
    this.recurringOption = value;
    localStorage.setItem('recurringOption', value);
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  redirectToDashboard(): void {
    localStorage.removeItem('donationAmount');
    localStorage.removeItem('recurringOption');
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getDonationProcessedText(amount: number): string {
    const translation = this.languageService.getTranslation('donation_processed_successfully');
    const formattedAmount = amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });
    return translation
      .replace('${{amount}}', formattedAmount)
      .replace('{{amount}}', formattedAmount);
  }

  toggleAccessibilityPanel(): void {
    this.showAccessibilityPanel = !this.showAccessibilityPanel;
  }

  trackSimpleModeChange(): void {
    // Clear optional fields when entering simple mode for clarity
    if (this.simpleMode) {
      this.updatesOptIn = false;
    }
  }
}
