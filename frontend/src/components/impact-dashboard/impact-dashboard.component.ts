import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface ImpactCard {
  icon: string;
  number: string;
  title: string;
  description: string;
  story: string;
  color: string;
}

@Component({
  selector: 'app-impact-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impact-dashboard.component.html',
  styleUrl: './impact-dashboard.component.scss',
})
export class ImpactDashboardComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  selectedCard: ImpactCard | null = null;

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  onCardClick(card: ImpactCard) {
    this.selectedCard = card;
  }

  closeModal() {
    this.selectedCard = null;
  }

  get impactCards(): ImpactCard[] {
    return [
      {
        icon: 'bed',
        number: '7,800',
        title: this.languageService.getTranslation('women_children_supported'),
        description: this.languageService.getTranslation('lives_changed_programs'),
        story: this.languageService.getTranslation('story_women_children_supported'),
        color: '#F28C88',
      },
      {
        icon: 'comments',
        number: '1,450',
        title: this.languageService.getTranslation('languages_spoken'),
        description: this.languageService.getTranslation('multilingual_support'),
        story: this.languageService.getTranslation('story_languages_spoken'),
        color: '#6B4FA3',
      },
      {
        icon: 'gavel',
        number: '960',
        title: this.languageService.getTranslation('crisis_support_available'),
        description: this.languageService.getTranslation('round_clock_assistance'),
        story: this.languageService.getTranslation('story_crisis_support'),
        color: '#C9B5E8',
      },
      {
        icon: 'box-open',
        number: '3,200',
        title: this.languageService.getTranslation('successfully_rebuilt_lives'),
        description: this.languageService.getTranslation('survivors_found_hope'),
        story: this.languageService.getTranslation('story_rebuilt_lives'),
        color: '#F28C88',
      },
    ];
  }
}
