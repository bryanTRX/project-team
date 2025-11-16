import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

interface DonorFeedback {
  name: string;
  amount: number;
  feedback: string;
  impact: string;
  date: string;
  avatar: string;
  color: string;
}

@Component({
  selector: 'app-donor-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-feedback.component.html',
  styleUrl: './donor-feedback.component.scss',
})
export class DonorFeedbackComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  donorFeedbacks: DonorFeedback[] = [
    {
      name: 'Jennifer M.',
      amount: 100,
      feedback:
        'Knowing that my monthly donation helps provide shelter and support to families in need gives me such peace of mind. I can see the real impact through the updates.',
      impact: 'Helped 3 families find safe housing this month',
      date: '2 weeks ago',
      avatar: 'https://i.pravatar.cc/150?img=5',
      color: '#6B5BCE', // primary-dark
    },
    {
      name: 'Michael R.',
      amount: 50,
      feedback:
        "I've been donating for over a year now, and it's incredible to see how my contributions have helped children get back to school and mothers find employment.",
      impact: "Supported 2 children's education and 1 job placement",
      date: '1 month ago',
      avatar: 'https://i.pravatar.cc/150?img=12',
      color: '#7B68EE', // primary
    },
    {
      name: 'Sophie L.',
      amount: 25,
      feedback:
        'Even a small monthly donation makes a difference! I love receiving updates about how my contribution is being used to help real people in my community.',
      impact: 'Provided emergency assistance to 1 family',
      date: '3 weeks ago',
      avatar: 'https://i.pravatar.cc/150?img=47',
      color: '#E85A6A', // secondary-dark
    },
    {
      name: 'David K.',
      amount: 100,
      feedback:
        'The transparency and regular updates make me confident that my donations are making a real difference. Keep up the amazing work!',
      impact: 'Funded counseling services for 4 individuals',
      date: '1 week ago',
      avatar: 'https://i.pravatar.cc/150?img=33',
      color: '#6B5BCE', // primary-dark
    },
    {
      name: 'Emma T.',
      amount: 50,
      feedback:
        "I started donating after learning about the organization's work. It's been wonderful to see the positive changes happening in people's lives.",
      impact: 'Assisted 2 families with legal support',
      date: '2 months ago',
      avatar: 'https://i.pravatar.cc/150?img=20',
      color: '#9B8BFF', // primary-light
    },
    {
      name: 'Robert P.',
      amount: 100,
      feedback:
        "My donation is one of the best investments I've made. Knowing I'm helping people rebuild their lives is incredibly rewarding.",
      impact: 'Enabled 3 months of shelter support',
      date: '3 weeks ago',
      avatar: 'https://i.pravatar.cc/150?img=15',
      color: '#7B68EE', // primary
    },
  ];

  constructor(public languageService: LanguageService) {}

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

  getSectionTitle(): string {
    return this.languageService.getTranslation('donor_feedback_title') || 'Hear from Our Donors';
  }

  getSectionSubtitle(): string {
    return (
      this.languageService.getTranslation('donor_feedback_subtitle') ||
      'See how your generosity creates real change'
    );
  }

  getImpactLabel(): string {
    return this.languageService.getTranslation('impact') || 'Impact';
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
