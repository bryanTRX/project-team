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
  styleUrl: './donation-tiers.component.scss'
})
export class DonationTiersComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  get tiers(): DonationTier[] {
    return [
      {
        amount: 25,
        color: '#E85A6A', // secondary-dark - rose foncé
        colorGradient: 'linear-gradient(135deg, #FF7A85, #E85A6A)',
        icon: 'fas fa-heart', // Cœur - représente l'aide et la compassion
        descriptionKey: 'tier_25_description',
        buttonText: this.languageService.getTranslation('give_25') || 'GIVE $25',
        preferred: false
      },
      {
        amount: 50,
        color: '#7B68EE', // primary - violet principal
        colorGradient: 'linear-gradient(135deg, #9B8BFF, #7B68EE, #6B5BCE)',
        icon: 'fas fa-users', // Groupe de personnes - représente la communauté et le refuge
        descriptionKey: 'tier_50_description',
        buttonText: this.languageService.getTranslation('give_50') || 'GIVE $50',
        preferred: true
      },
      {
        amount: 100,
        color: '#6B5BCE', // primary-dark - violet foncé
        colorGradient: 'linear-gradient(135deg, #7B68EE, #6B5BCE)',
        icon: 'fas fa-shield-alt', // Bouclier - représente la protection et l'impact majeur
        descriptionKey: 'tier_100_description',
        buttonText: this.languageService.getTranslation('give_100') || 'GIVE $100',
        preferred: false
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

