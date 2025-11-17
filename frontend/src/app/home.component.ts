import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { QuickDonationComponent } from '../components/quick-donation/quick-donation.component';
import { ImpactDashboardComponent } from '../components/impact-dashboard/impact-dashboard.component';
import { StoriesComponent } from '../components/stories/stories.component';
import { DonorFeedbackComponent } from '../components/donor-feedback/donor-feedback.component';
import { Footer } from '../components/footer/footer';
import { LiveTrackerComponent } from '../components/live-tracker/live-tracker';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    QuickDonationComponent,
    ImpactDashboardComponent,
    StoriesComponent,
    DonorFeedbackComponent,
    LiveTrackerComponent,
    Footer,
  ],
  template: `
    <main id="home" class="home-layout">
      <app-hero></app-hero>
      <app-impact-dashboard></app-impact-dashboard>
      <section class="live-tracker-section">
        <app-live-tracker></app-live-tracker>
      </section>
      <div class="section-divider" aria-hidden="true"></div>
      <app-quick-donation></app-quick-donation>
      <div class="section-divider section-divider--compact" aria-hidden="true"></div>
      <section id="stories">
        <app-stories></app-stories>
      </section>
      <div class="section-divider section-divider--tight" aria-hidden="true"></div>
      <app-donor-feedback></app-donor-feedback>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      main {
        width: 100%;
        min-height: calc(100vh - 200px);
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .live-tracker-section {
        margin-top: -0.5rem;
        padding: 0;
      }

      .section-divider {
        width: 720px;
        height: 2px;
        margin: 6rem auto 1rem;
        border-radius: 999px;
        background: linear-gradient(
          90deg,
          rgba(123, 104, 238, 0) 0%,
          rgba(123, 104, 238, 0.3) 50%,
          rgba(123, 104, 238, 0) 100%
        );
        box-shadow: 0 2px 6px rgba(123, 104, 238, 0.14);
      }

      .section-divider--compact {
        margin-top: 2.7rem;
      }

      .section-divider--tight {
        margin: 2.4rem auto 0.5rem;
      }
    `,
  ],
})
export class HomeComponent {}
