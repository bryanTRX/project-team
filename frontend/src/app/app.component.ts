import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeroComponent } from '../components/hero/hero.component';
import { QuickDonationComponent } from '../components/quick-donation/quick-donation.component';
import { ImpactDashboardComponent } from '../components/impact-dashboard/impact-dashboard.component';
import { StoriesComponent } from '../components/stories/stories.component';
import { CommunityComponent } from '../components/community/community.component';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    QuickDonationComponent,
    ImpactDashboardComponent,
    StoriesComponent,
    CommunityComponent,
    Footer
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shield-of-athena';
}
