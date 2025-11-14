import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HeroComponent } from '../components/hero/hero.component';
import { QuickDonationComponent } from '../components/quick-donation/quick-donation.component';
import { ImpactDashboardComponent } from '../components/impact-dashboard/impact-dashboard.component';
import { StoriesComponent } from '../components/stories/stories.component';
import { CommunityComponent } from '../components/community/community.component';
import { Footer } from '../components/footer/footer';
import { LiveTrackerComponent } from '../components/live-tracker/live-tracker';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		NavbarComponent,
		HeroComponent,
		QuickDonationComponent,
		LiveTrackerComponent,
		ImpactDashboardComponent,
		StoriesComponent,
		CommunityComponent,
		Footer
	],
	template: `
		<app-navbar></app-navbar>
		<main id="home">
			<app-hero></app-hero>
			<app-quick-donation></app-quick-donation>
			<section id="tracker">
				<app-live-tracker></app-live-tracker>
			</section>
			<section id="impact">
				<app-impact-dashboard></app-impact-dashboard>
			</section>
			<section id="stories">
				<app-stories></app-stories>
			</section>
			<app-community></app-community>
		</main>
		<app-footer></app-footer>
	`,
	styles: [`
		main {
			width: 100%;
			min-height: calc(100vh - 200px);
		}
	`]
})
export class HomeComponent {
}

