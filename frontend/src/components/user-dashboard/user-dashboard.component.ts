import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  user: UserProfile | null = null;

  news: ImpactNewsItem[] = [
    {
      title: 'Winter Warmth Initiative: 500 Families Helped',
      description: 'Your donations provided winter clothing and heating assistance to families in need.',
      date: 'Nov 12, 2024',
      label: 'Program Update'
    },
    {
      title: 'Education Fund Launches New Scholarship Program',
      description: 'Thanks to generous donors, we\'ve awarded scholarships to 45 deserving students this semester.',
      date: 'Nov 5, 2024',
      label: 'Milestone'
    }
  ];

  donationHistory: DonationHistoryItem[] = [
    { date: 'Nov 10, 2024', frequency: 'One-time', amount: 250, recurring: false },
    { date: 'Oct 15, 2024', frequency: 'Monthly', amount: 100, recurring: true },
    { date: 'Oct 1, 2024', frequency: 'One-time', amount: 500, recurring: false },
    { date: 'Sep 15, 2024', frequency: 'Monthly', amount: 100, recurring: true },
    { date: 'Sep 5, 2024', frequency: 'Monthly', amount: 100, recurring: true }
  ];

  discussions: ForumDiscussion[] = [
    { title: 'Success Stories', replies: 24 },
    { title: 'Holiday Support Drive', replies: 18 },
    { title: 'New Program Launch', replies: 12 }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/']);
    }
  }

  get progressPercentage(): number {
    if (!this.user) {
      return 0;
    }
    return Math.min(100, Math.round((this.user.totalDonated / this.user.goal) * 100));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
