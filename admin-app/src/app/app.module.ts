import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { TripCardComponent } from './trip-card/trip-card.component';
import { TripFormComponent } from './trip-form/trip-form.component';
import { TripDataService } from './services/trip-data.service';

@NgModule({
  declarations: [
    AppComponent,
    TripListComponent,
    TripCardComponent,
    TripFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
    // HttpClientModule removed - deprecated in Angular 18+
  ],
  providers: [
    TripDataService,
    provideHttpClient(withInterceptorsFromDi()) // New Angular 18+ way
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }