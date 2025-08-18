import { Component, OnInit } from '@angular/core';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css'],
  standalone: false  // REQUIRED for NgModule
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingTrip: Trip | null = null;

  constructor(private tripDataService: TripDataService) { }

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.error = '';
    
    this.tripDataService.getTrips().subscribe({
      next: (data: Trip[]) => {
        console.log('✅ Trips loaded successfully:', data.length);
        this.trips = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading trips:', error);
        this.error = 'Failed to load trips. Please make sure your API server is running.';
        this.loading = false;
      }
    });
  }

  onAddNewTrip(): void {
    this.editingTrip = null;
    this.showForm = true;
  }

  onEditTrip(trip: Trip): void {
    this.editingTrip = trip;
    this.showForm = true;
  }

  onDeleteTrip(tripCode: string): void {
    this.loading = true;
    
    this.tripDataService.deleteTrip(tripCode).subscribe({
      next: (response) => {
        this.loadTrips();
      },
      error: (error) => {
        this.error = 'Failed to delete trip. Please try again.';
        this.loading = false;
      }
    });
  }

  onTripSaved(): void {
    this.showForm = false;
    this.editingTrip = null;
    this.loadTrips();
  }

  onFormCanceled(): void {
    this.showForm = false;
    this.editingTrip = null;
  }

  onErrorDismissed(): void {
    this.error = '';
  }

  trackByTripCode(index: number, trip: Trip): string {
    return trip.code;
  }

  getFormattedAveragePrice(): string {
    if (this.trips.length === 0) return '$0.00';
    const total = this.trips.reduce((sum, trip) => sum + parseFloat(trip.perPerson), 0);
    const avg = total / this.trips.length;
    return `$${avg.toFixed(2)}`;
  }

  getAverageLength(): string {
    if (this.trips.length === 0) return '0 days';
    const totalDays = this.trips.reduce((sum, trip) => {
      const days = parseInt(trip.length.split(' ')[0]) || 0;
      return sum + days;
    }, 0);
    const avgDays = Math.round(totalDays / this.trips.length);
    return `${avgDays} days`;
  }
}