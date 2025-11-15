import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  constructor(
    private authService: AuthService,
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goHome(): void {
    // Si on est déjà sur la page d'accueil, scroll vers la section home
    if (this.router.url === '/' || this.router.url === '') {
      this.scrollToSection('home');
    } else {
      // Sinon, naviguer vers la page d'accueil
      this.router.navigate(['/']).then(() => {
        // Attendre un peu que la page se charge puis scroll vers home
        setTimeout(() => {
          this.scrollToSection('home');
        }, 100);
      });
    }
    this.menuOpen = false;
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

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const fallback = img.nextElementSibling as HTMLElement;
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  }
}
