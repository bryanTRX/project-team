import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  constructor(public languageService: LanguageService, private router: Router) {}

  scrollToDonation(): void {
    this.router.navigate(['/donate']);
  }

  scrollToStories(): void {
    const element = document.getElementById('stories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

