import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    public languageService: LanguageService
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
