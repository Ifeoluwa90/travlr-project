import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css'],
  standalone: false  // REQUIRED for NgModule
})
export class TripCardComponent {
  @Input() trip!: Trip;
  @Output() editTrip = new EventEmitter<Trip>();
  @Output() deleteTrip = new EventEmitter<string>();

  onEditTrip(): void {
    this.editTrip.emit(this.trip);
  }

  onDeleteTrip(): void {
    if (confirm(`Are you sure you want to delete "${this.trip.name}"?`)) {
      this.deleteTrip.emit(this.trip.code);
    }
  }

  getImagePath(): string {
    const imagePath = `assets/images/${this.trip.image}`;
    console.log(`🖼️ Loading image for ${this.trip.name}: ${imagePath}`);
    return imagePath;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: string): string {
    return `$${price}`;
  }

  truncateDescription(description: string, length: number): string {
    if (description.length <= length) {
      return description;
    }
    return description.slice(0, length) + '...';
  }
}