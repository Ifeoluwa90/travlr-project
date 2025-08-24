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
    console.log('🚀 TripListComponent: Starting to load trips...');
    console.log('🚀 Service instance:', this.tripDataService);
    this.loading = true;
    this.error = '';
    
    // Test direct HTTP call first
    try {
      console.log('🧪 Testing direct HTTP call...');
      this.tripDataService.getTrips().subscribe({
        next: (data: Trip[]) => {
          console.log('✅ Trips loaded successfully:', data.length, data);
          this.trips = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error loading trips - Full error object:', error);
          console.error('❌ Error constructor:', error?.constructor?.name);
          console.error('❌ Error type:', typeof error);
          console.error('❌ Error status:', error?.status);
          console.error('❌ Error message:', error?.message);
          console.error('❌ Error details:', error?.error);
          console.error('❌ Error statusText:', error?.statusText);
          console.error('❌ Error name:', error?.name);
          console.error('❌ All error keys:', Object.keys(error || {}));
          
          // Try to stringify the entire error
          try {
            console.error('❌ Stringified error:', JSON.stringify(error, null, 2));
          } catch (e) {
            console.error('❌ Could not stringify error:', e);
          }
          
          const errorMessage = error?.message || error?.statusText || error?.error?.message || 'Unknown error occurred';
          this.error = `Failed to load trips: ${errorMessage}. Please make sure your API server is running.`;
          this.loading = false;
        },
        complete: () => {
          console.log('🏁 HTTP request completed');
        }
      });
    } catch (syncError: any) {
      console.error('💥 Synchronous error during subscription:', syncError);
      this.error = `Sync error: ${syncError?.message || 'Unknown sync error'}`;
      this.loading = false;
    }
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