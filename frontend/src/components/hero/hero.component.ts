import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  constructor(public languageService: LanguageService) {}

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

  scrollToDonation(): void {
    const element = document.getElementById('quick-donation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToStories(): void {
    const element = document.getElementById('stories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

