import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface DonationTier {
  amount: number;
  color: string;
  icon: string;
  descriptionKey: string;
  buttonText: string;
}

@Component({
  selector: 'app-donation-tiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-tiers.component.html',
  styleUrl: './donation-tiers.component.scss'
})
export class DonationTiersComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  get tiers(): DonationTier[] {
    return [
      {
        amount: 25,
        color: '#E85A6A',
        icon: 'fas fa-heart',
        descriptionKey: 'tier_25_description',
        buttonText: this.languageService.getTranslation('give_25') || 'GIVE $25'
      },
      {
        amount: 50,
        color: '#F5A623',
        icon: 'fas fa-balance-scale',
        descriptionKey: 'tier_50_description',
        buttonText: this.languageService.getTranslation('give_50') || 'GIVE $50'
      },
      {
        amount: 100,
        color: '#4ECDC4',
        icon: 'fas fa-shield-alt',
        descriptionKey: 'tier_100_description',
        buttonText: this.languageService.getTranslation('give_100') || 'GIVE $100'
      }
    ];
  }

  getTierDescription(tier: DonationTier): string {
    return this.languageService.getTranslation(tier.descriptionKey) || tier.descriptionKey;
  }

  getSectionTitle(): string {
    return this.languageService.getTranslation('you_can_help_real_impact') || 'Your monthly support makes a real difference in people\'s lives.';
  }

  constructor(
    public languageService: LanguageService,
    private router: Router
  ) {}

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

  selectTier(tier: DonationTier): void {
    // Save donation details to localStorage
    localStorage.setItem('donationAmount', tier.amount.toString());
    localStorage.setItem('recurringOption', 'monthly');
    
    // Redirect to payment page
    this.router.navigate(['/payment']);
  }
}

