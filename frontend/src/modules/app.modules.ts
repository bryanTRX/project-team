import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../app/app.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent,
    NavbarComponent
  ],
})
export class AppModule {}
