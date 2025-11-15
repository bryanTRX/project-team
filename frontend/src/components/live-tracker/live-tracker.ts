import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-live-tracker',
  templateUrl: './live-tracker.html',
  styleUrls: ['./live-tracker.scss'],
})
export class LiveTrackerComponent implements AfterViewInit {

  @ViewChildren('counter') counters!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  private hasAnimated = false;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.startCounters();
          this.observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    this.counters.forEach(counter => {
      this.observer.observe(counter.nativeElement);
    });
  }

  startCounters() {
    this.counters.forEach(counterEl => {
      const el = counterEl.nativeElement;

      const target = Number(el.getAttribute('data-target'));
      const speed = Number(el.getAttribute('data-speed')) || 50;

      const duration = speed * 50;
      const start = performance.now();

      const easeOutQuad = (t: number) => t * (2 - t);

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);

        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target;
          this.startLiveUpdates(el, target); 
        }
      };

      requestAnimationFrame(animate);
    });
  }

  startLiveUpdates(el: HTMLElement, current: number) {
    const randomIncreaseLoop = () => {
      const increment = Math.floor(Math.random() * 4) + 1; 
      current += increment;

      el.textContent = current.toString();

      const delay = Math.random() * 4500 + 1500;

      setTimeout(randomIncreaseLoop, delay);
    };

    setTimeout(randomIncreaseLoop, 1000);
  }
}
