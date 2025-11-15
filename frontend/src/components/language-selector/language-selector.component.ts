import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  languages: Language[] = [];
  currentLanguage: string = 'en';
  isOpen: boolean = false;
  private languageSubscription?: Subscription;

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.languages = this.languageService.languages;
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.isOpen = false;
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectLanguage(languageCode: string): void {
    this.languageService.setLanguage(languageCode);
    this.isOpen = false;
  }

  getCurrentFlag(): string {
    const lang = this.languages.find((l) => l.code === this.currentLanguage);
    return lang?.flag || '🇺🇸';
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find((l) => l.code === this.currentLanguage);
    return lang?.nativeName || 'English';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector-wrapper')) {
      this.isOpen = false;
    }
  }
}
