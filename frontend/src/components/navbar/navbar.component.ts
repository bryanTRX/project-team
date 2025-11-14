import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LanguageSelectorComponent, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  scrollToDonation(): void {
    this.menuOpen = false;
    // Navigate to donation page
    this.router.navigate(['/donate']);
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
