import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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

interface CommunityFeature {
  icon: string;
  title: string;
  description: string;
  extra?: string;
}

@Component({
  selector: 'app-donor-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-feedback.component.html',
  styleUrl: './donor-feedback.component.scss',
})
export class DonorFeedbackComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;
  @ViewChild('feedbackTrack') feedbackTrack?: ElementRef<HTMLDivElement>;
  communityFeatures: CommunityFeature[] = [];
  showPrevArrow = false;
  showNextArrow = false;
  private trackScrollListener?: () => void;

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
    this.buildCommunityFeatures();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.buildCommunityFeatures();
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    this.detachScrollListener();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.attachScrollListener();
      this.updateCarouselArrows();
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateCarouselArrows();
  }

  getSectionTitle(): string {
    return (
      this.languageService.getTranslation('join_community_compassion') ||
      'Join a Community Built on Compassion'
    );
  }

  getImpactLabel(): string {
    return this.languageService.getTranslation('impact') || 'Impact';
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  getDonorStatLabel(): string {
    return this.languageService.getTranslation('compassionate_donors') || 'Compassionate Donors';
  }

  private buildCommunityFeatures() {
    this.communityFeatures = [
      {
        icon: 'trophy',
        title: this.languageService.getTranslation('milestone') || 'Milestone',
        description:
          this.languageService.getTranslation('see_donations_making_difference') ||
          'See how your donations are making a difference',
      },
      {
        icon: 'share-alt',
        title: this.languageService.getTranslation('our_impact') || 'Our Impact',
        description:
          this.languageService.getTranslation('support_creates_ripples') ||
          'Your support creates ripples of change.',
      },
      {
        icon: 'users',
        title: this.languageService.getTranslation('community_forum') || 'Community Forum',
        description:
          this.languageService.getTranslation('connect_with_supporters') ||
          'Connect with fellow supporters and share impact stories',
        extra: `15,000+ ${this.getDonorStatLabel()}`,
      },
    ];
  }

  scrollCarousel(direction: 'prev' | 'next') {
    const track = this.feedbackTrack?.nativeElement;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>('.feedback-card');
    const cardWidth = firstCard ? firstCard.offsetWidth : track.clientWidth;
    const gap = 16; // matches CSS gap of 1rem
    const scrollAmount = cardWidth + gap;
    const delta = direction === 'next' ? scrollAmount : -scrollAmount;

    track.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateCarouselArrows(), 400);
  }

  private attachScrollListener() {
    const track = this.feedbackTrack?.nativeElement;
    if (!track || this.trackScrollListener) return;

    this.trackScrollListener = () => this.updateCarouselArrows();
    track.addEventListener('scroll', this.trackScrollListener, { passive: true });
  }

  private detachScrollListener() {
    const track = this.feedbackTrack?.nativeElement;
    if (track && this.trackScrollListener) {
      track.removeEventListener('scroll', this.trackScrollListener);
      this.trackScrollListener = undefined;
    }
  }

  private updateCarouselArrows() {
    const track = this.feedbackTrack?.nativeElement;
    if (!track) {
      this.showPrevArrow = false;
      this.showNextArrow = false;
      return;
    }

    const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0);
    const tolerance = 12;
    const scrollLeft = Math.round(track.scrollLeft);
    this.showPrevArrow = scrollLeft > tolerance;
    this.showNextArrow = maxScrollLeft - scrollLeft > tolerance;
  }
}
