import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface DonationTier {
  amount: number;
  color: string;
  colorGradient: string;
  icon: string;
  descriptionKey: string;
  buttonText: string;
  preferred?: boolean;
}

@Component({
  selector: 'app-donation-tiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-tiers.component.html',
  styleUrl: './donation-tiers.component.scss',
})
export class DonationTiersComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  get tiers(): DonationTier[] {
    return [
      {
        amount: 25,
        color: '#E85A6A',
        colorGradient: 'linear-gradient(135deg, #FF7A85, #E85A6A)',
        icon: 'fas fa-heart',
        descriptionKey: 'tier_25_description',
        buttonText: this.languageService.getTranslation('give_25') || 'GIVE $25',
        preferred: false,
      },
      {
        amount: 50,
        color: '#7B68EE',
        colorGradient: 'linear-gradient(135deg, #9B8BFF, #7B68EE, #6B5BCE)',
        icon: 'fas fa-users',
        descriptionKey: 'tier_50_description',
        buttonText: this.languageService.getTranslation('give_50') || 'GIVE $50',
        preferred: true,
      },
      {
        amount: 100,
        color: '#6B5BCE',
        colorGradient: 'linear-gradient(135deg, #7B68EE, #6B5BCE)',
        icon: 'fas fa-shield-alt',
        descriptionKey: 'tier_100_description',
        buttonText: this.languageService.getTranslation('give_100') || 'GIVE $100',
        preferred: false,
      },
    ];
  }

  getTierDescription(tier: DonationTier): string {
    return this.languageService.getTranslation(tier.descriptionKey) || tier.descriptionKey;
  }

  getSectionTitle(): string {
    return (
      this.languageService.getTranslation('you_can_help_real_impact') ||
      "Your monthly support makes a real difference in people's lives."
    );
  }

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

  selectTier(tier: DonationTier): void {
    localStorage.setItem('donationAmount', tier.amount.toString());
    localStorage.setItem('recurringOption', 'monthly');
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
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
