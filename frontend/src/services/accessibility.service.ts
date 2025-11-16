import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private textSizeSubject = new BehaviorSubject<'normal' | 'large' | 'xlarge'>('normal');

  textSize$: Observable<'normal' | 'large' | 'xlarge'> = this.textSizeSubject.asObservable();

  constructor() {
    const savedTextSize = localStorage.getItem('textSize') as 'normal' | 'large' | 'xlarge';

    if (savedTextSize && ['normal', 'large', 'xlarge'].includes(savedTextSize)) {
      this.textSizeSubject.next(savedTextSize);
    } else {
      this.textSizeSubject.next('normal');
    }

    if (typeof document !== 'undefined') {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => this.applyTextSize(), 0);
      } else {
        document.addEventListener('DOMContentLoaded', () => this.applyTextSize());
      }
    }

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
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('text-normal', 'text-large', 'text-xlarge');
      document.body.classList.add(`text-${this.textSize}`);

      if (document.documentElement) {
        document.documentElement.classList.remove('text-normal', 'text-large', 'text-xlarge');
        document.documentElement.classList.add(`text-${this.textSize}`);
      }
    }
  }
}
