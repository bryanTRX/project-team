import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  errorMessage = '';
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).then((authenticated) => {
      if (authenticated) {
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
        return;
      }

      this.errorMessage = this.languageService.getTranslation('invalid_credentials');
    });
  }

  onFacebookLogin(): void {
    this.authService.loginWithFacebook().then((ok) => {
      if (ok) this.router.navigate(['/dashboard']);
    });
  }

  onGoogleLogin(): void {
    this.authService.loginWithGoogle().then((ok) => {
      if (ok) this.router.navigate(['/dashboard']);
    });
  }
}
