import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { TierBadgesComponent, TierBadge } from '../tier-badges/tier-badges.component';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface ImpactNewsItem {
  title: string;
  description: string;
  date: string;
  label: string;
}

interface DonationHistoryItem {
  date: string;
  frequency: string;
  amount: number;
  recurring: boolean;
}

interface ForumDiscussion {
  title: string;
  replies: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TierBadgesComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(TierBadgesComponent) tierBadgesComponent!: TierBadgesComponent;

  user: UserProfile | null = null;
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  news: ImpactNewsItem[] = [
    {
      title: 'Winter Warmth Initiative: 500 Families Helped',
      description:
        'Your donations provided winter clothing and heating assistance to families in need.',
      date: 'Nov 12, 2024',
      label: 'Program Update',
    },
    {
      title: 'Education Fund Launches New Scholarship Program',
      description:
        "Thanks to generous donors, we've awarded scholarships to 45 deserving students this semester.",
      date: 'Nov 5, 2024',
      label: 'Milestone',
    },
  ];

  donationHistory: DonationHistoryItem[] = [
    { date: 'Nov 10, 2024', frequency: 'One-time', amount: 250, recurring: false },
    { date: 'Oct 15, 2024', frequency: 'Monthly', amount: 100, recurring: true },
    { date: 'Oct 1, 2024', frequency: 'One-time', amount: 500, recurring: false },
  ];

  discussions: ForumDiscussion[] = [
    { title: 'Success Stories', replies: 24 },
    { title: 'Holiday Support Drive', replies: 18 },
    { title: 'New Program Launch', replies: 12 },
  ];

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

    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.tierBadgesComponent) {
        this.tierBadgesComponent.calculateTierProgress();
      }
    }, 0);
  }

  getFrequencyTranslation(frequency: string): string {
    const freqMap: { [key: string]: string } = {
      'One-time': 'one_time',
      Monthly: 'monthly',
      Quarterly: 'quarterly',
      Yearly: 'yearly',
    };
    const key = freqMap[frequency] || frequency.toLowerCase().replace('-', '_');
    return this.languageService.getTranslation(key);
  }

  getPathToStatusText(tierName: string): string {
    return this.languageService.getTranslation('path_to_status').replace('{{tier}}', tierName);
  }

  getReachTierStatusText(tierName: string, amount: number, remaining: number): string {
    const translation = this.languageService.getTranslation('reach_tier_status');
    const formattedAmount = amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });
    const formattedRemaining = remaining.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });
    return translation
      .replace('{{tier}}', tierName)
      .replace('${{amount}}', formattedAmount)
      .replace('{{amount}}', formattedAmount)
      .replace('${{remaining}}', formattedRemaining)
      .replace('{{remaining}}', formattedRemaining);
  }

  get currentTier(): TierBadge | null {
    return this.tierBadgesComponent?.currentTier || null;
  }

  get nextTier(): TierBadge | null {
    return this.tierBadgesComponent?.nextTier || null;
  }

  get progressPercentage(): number {
    return Math.min(100, Math.round(this.tierBadgesComponent?.progressToNextTier || 0));
  }

  getAmountToNextTier(): number {
    return this.tierBadgesComponent?.getAmountToNextTier() || 0;
  }

  get personalGoalTarget(): number {
    return this.user?.goal || 0;
  }

  get personalGoalProgress(): number {
    const goal = this.personalGoalTarget;
    if (!goal) {
      return 0;
    }
    const donated = this.user?.totalDonated || 0;
    return Math.min(100, Math.round((donated / goal) * 100));
  }

  get personalGoalRemaining(): number {
    const goal = this.personalGoalTarget;
    const donated = this.user?.totalDonated || 0;
    return Math.max(0, goal - donated);
  }

  get memberSinceDate(): string {
    if (!this.donationHistory.length) {
      return '2023';
    }
    return this.donationHistory[this.donationHistory.length - 1].date;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  startNewDonation(): void {
    this.router.navigate(['/payment']);
  }
}
