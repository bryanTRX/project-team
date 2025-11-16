import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { QuickDonationComponent } from '../components/quick-donation/quick-donation.component';
import { ImpactDashboardComponent } from '../components/impact-dashboard/impact-dashboard.component';
import { StoriesComponent } from '../components/stories/stories.component';
import { DonorFeedbackComponent } from '../components/donor-feedback/donor-feedback.component';
import { CommunityComponent } from '../components/community/community.component';
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
    CommunityComponent,
    Footer,
  ],
  template: `
    <main id="home">
      <app-hero></app-hero>
      <app-impact-dashboard></app-impact-dashboard>
      <section class="live-tracker-section">
        <app-live-tracker></app-live-tracker>
      </section>
      <app-quick-donation></app-quick-donation>
      <section id="stories">
        <app-stories></app-stories>
      </section>
      <app-donor-feedback></app-donor-feedback>
      <app-community></app-community>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      main {
        width: 100%;
        min-height: calc(100vh - 200px);
      }
    `,
  ],
})
export class HomeComponent {}
