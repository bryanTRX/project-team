import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-tracker',
  templateUrl: './live-tracker.html',
  styleUrls: ['./live-tracker.scss'],
})
export class LiveTrackerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counter') counters!: QueryList<ElementRef>;
  @ViewChild('bigCounter') bigCounter!: ElementRef;

  currentLanguage: string = 'en';
  private languageSubscription?: Subscription;

  private observer!: IntersectionObserver;
  private hasAnimated = false;

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.startCounters();
            this.observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    this.counters.forEach((counter) => {
      this.observer.observe(counter.nativeElement);
    });

    if (this.bigCounter && this.bigCounter.nativeElement) {
      this.observer.observe(this.bigCounter.nativeElement);
    }
  }

  startCounters() {
    const elements: HTMLElement[] = [];

    if (this.bigCounter && this.bigCounter.nativeElement) {
      elements.push(this.bigCounter.nativeElement);
    }

    this.counters.forEach((counterEl) => {
      elements.push(counterEl.nativeElement);
    });

    elements.forEach((el) => {
      const target = Number(el.getAttribute('data-target')) || 0;
      const speed = Number(el.getAttribute('data-speed')) || 50;
      const duration = speed * 50;
      const start = performance.now();

      const isBig = el.classList.contains('big-counter');

      const easeOutQuad = (t: number) => t * (2 - t);

      const formatNumber = (n: number) => n.toLocaleString();

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);

        const value = Math.floor(eased * target);

        if (isBig) {
          el.textContent = '$' + formatNumber(value);
        } else {
          el.textContent = formatNumber(value);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (isBig) {
            el.textContent = '$' + formatNumber(target);
          } else {
            el.textContent = formatNumber(target);
          }
          this.startLiveUpdates(el, target, isBig);
        }
      };

      requestAnimationFrame(animate);
    });
  }

  startLiveUpdates(el: HTMLElement, current: number, isBig = false) {
    const randomIncreaseLoop = () => {
      const increment = isBig
        ? Math.floor(Math.random() * 100) + 5
        : Math.floor(Math.random() * 4) + 1;

      current += increment;

      if (isBig) {
        el.textContent = '$' + current.toLocaleString();
      } else {
        el.textContent = current.toLocaleString();
      }

      const delay = Math.random() * 4500 + 1500;
      setTimeout(randomIncreaseLoop, delay);
    };

    setTimeout(randomIncreaseLoop, 1000);
  }

  get labels() {
    return {
      liveImpactTracker: this.languageService.getTranslation('live_impact_tracker'),
      mealsProvided: this.languageService.getTranslation('meals_provided'),
      medicalKits: this.languageService.getTranslation('medical_kits'),
      transportRides: this.languageService.getTranslation('transport_rides'),
      livesTouched: this.languageService.getTranslation('lives_touched'),
    };
  }
}
