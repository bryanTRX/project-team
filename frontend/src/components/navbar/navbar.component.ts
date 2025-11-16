import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { AccessibilityService } from '../../services/accessibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  dropdownOpen = false;
  accessibilityMenuOpen = false;
  currentLanguage: string = 'en';
  textSize: 'normal' | 'large' | 'xlarge' = 'normal';
  private languageSubscription?: Subscription;
  private textSizeSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    public languageService: LanguageService,
    private router: Router,
    private accessibilityService: AccessibilityService,
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    this.textSize = this.accessibilityService.textSize;

    this.textSizeSubscription = this.accessibilityService.textSize$.subscribe((value) => {
      this.textSize = value;
    });

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.textSizeSubscription) {
      this.textSizeSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.closeDropdown();
    }
    if (!target.closest('.accessibility-menu-wrapper')) {
      this.closeAccessibilityMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goHome(): void {
    if (this.router.url === '/' || this.router.url === '') {
      this.scrollToSection('home');
    } else {
      this.router.navigate(['/']).then(() => {
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

  preventNavigation(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.menuOpen = false;
  }

  openDonationPage(event: Event): void {
    event.preventDefault();
    this.goHome();
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  goToSettings(): void {
    this.closeDropdown();
    this.router.navigate(['/dashboard']);
    setTimeout(() => {}, 100);
  }

  goToPersonalInfo(): void {
    this.closeDropdown();
    this.router.navigate(['/dashboard']);
    setTimeout(() => {}, 100);
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/']);
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

  toggleAccessibilityMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.accessibilityMenuOpen = !this.accessibilityMenuOpen;
  }

  closeAccessibilityMenu(): void {
    this.accessibilityMenuOpen = false;
  }

  onTextSizeChange(size: 'normal' | 'large' | 'xlarge'): void {
    this.accessibilityService.setTextSize(size);
  }
}
