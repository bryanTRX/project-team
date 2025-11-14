import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  scrollToDonation(): void {
    const element = document.getElementById('quick-donation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.menuOpen = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
