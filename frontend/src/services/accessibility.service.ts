import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private textSizeSubject = new BehaviorSubject<'normal' | 'large' | 'xlarge'>('normal');

  textSize$: Observable<'normal' | 'large' | 'xlarge'> = this.textSizeSubject.asObservable();

  constructor() {
    // Load from localStorage if available
    const savedTextSize = localStorage.getItem('textSize') as 'normal' | 'large' | 'xlarge';

    if (savedTextSize && ['normal', 'large', 'xlarge'].includes(savedTextSize)) {
      this.textSizeSubject.next(savedTextSize);
    } else {
      // Default to normal if nothing is saved
      this.textSizeSubject.next('normal');
    }

    // Apply initial settings after DOM is ready
    if (typeof document !== 'undefined') {
      // If document is already loaded
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => this.applyTextSize(), 0);
      } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => this.applyTextSize());
      }
    }

    // Subscribe to changes to apply settings
    this.textSize$.subscribe(() => {
      if (typeof document !== 'undefined') {
        this.applyTextSize();
      }
    });
  }

  get textSize(): 'normal' | 'large' | 'xlarge' {
    return this.textSizeSubject.value;
  }

  setTextSize(size: 'normal' | 'large' | 'xlarge'): void {
    this.textSizeSubject.next(size);
    localStorage.setItem('textSize', size);
    this.applyTextSize();
  }

  private applyTextSize(): void {
    // Apply text size globally on body element and html element for maximum compatibility
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('text-normal', 'text-large', 'text-xlarge');
      document.body.classList.add(`text-${this.textSize}`);
      
      // Also apply to html element for broader CSS inheritance
      if (document.documentElement) {
        document.documentElement.classList.remove('text-normal', 'text-large', 'text-xlarge');
        document.documentElement.classList.add(`text-${this.textSize}`);
      }
    }
  }
}

