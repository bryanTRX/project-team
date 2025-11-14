import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-live-tracker',
  imports: [],
  templateUrl: './live-tracker.html',
  styleUrl: './live-tracker.scss',
})
export class LiveTrackerComponent implements AfterViewInit {

  @ViewChildren('counter') counters!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Ensure the view is ready
    setTimeout(() => this.startCounters());
  }

  startCounters() {
    console.log('Counters found:', this.counters.length);

    this.counters.forEach(counterEl => {
      const el = counterEl.nativeElement;

      const target = Number(el.getAttribute('data-target'));
      const speed = Number(el.getAttribute('data-speed')) || 80;

      const duration = speed * 7;
      const start = performance.now();

      const easeOutQuad = (t: number) => t * (2 - t);

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        const eased = easeOutQuad(progress);

        const value = Math.floor(eased * target);
        el.textContent = value;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(animate);
    });
  }
}