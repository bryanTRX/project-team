import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface CommunityFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  get features(): CommunityFeature[] {
    return [
      {
        icon: 'trophy',
        title: this.languageService.getTranslation('milestone'),
        description: this.languageService.getTranslation('see_donations_making_difference'),
      },
      {
        icon: 'share-alt',
        title: this.languageService.getTranslation('our_impact'),
        description: this.languageService.getTranslation('support_creates_ripples'),
      },
      {
        icon: 'users',
        title: this.languageService.getTranslation('community_forum'),
        description: this.languageService.getTranslation('connect_with_supporters'),
      },
    ];
  }

  constructor(public languageService: LanguageService) {}

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
}
