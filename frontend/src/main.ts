import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        // Always reset to top when navigating to a new page.
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
  ],
}).catch((err) => console.error(err));
