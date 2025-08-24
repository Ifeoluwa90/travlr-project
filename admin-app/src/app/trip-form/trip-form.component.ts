import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
  standalone: false  // REQUIRED for NgModule
})
export class TripFormComponent implements OnInit {
  @Input() trip: Trip | null = null;
  @Output() tripSaved = new EventEmitter<void>();
  @Output() formCanceled = new EventEmitter<void>();

  tripForm!: FormGroup;
  isSubmitting = false;
  error = '';
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private tripDataService: TripDataService
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.trip;
    this.createForm();
    if (this.trip) {
      this.populateForm();
    }
  }

  createForm(): void {
    this.tripForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{5,10}$/)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      length: ['', [Validators.required, Validators.pattern(/^\d+\s+(day|days)$/)]],
      start: ['', [Validators.required]],
      resort: ['', [Validators.required, Validators.minLength(3)]],
      perPerson: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    if (this.isEditMode) {
      this.tripForm.get('code')?.disable();
    }
  }

  populateForm(): void {
    if (this.trip) {
      const startDate = new Date(this.trip.start);
      const formattedDate = startDate.toISOString().split('T')[0];

      this.tripForm.patchValue({
        code: this.trip.code,
        name: this.trip.name,
        length: this.trip.length,
        start: formattedDate,
        resort: this.trip.resort,
        perPerson: this.trip.perPerson,
        image: this.trip.image,
        description: this.trip.description
      });
    }
  }

  onSubmit(): void {
    if (this.tripForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = '';

      const formData = this.tripForm.value;

      if (this.isEditMode) {
        formData.code = this.trip?.code;
      }

      if (this.isEditMode) {
        this.tripDataService.updateTrip(formData.code, formData).subscribe({
          next: () => this.tripSaved.emit(),
          error: (error) => {
            this.error = error;
            this.isSubmitting = false;
          }
        });
      } else {
        this.tripDataService.addTrip(formData).subscribe({
          next: () => this.tripSaved.emit(),
          error: (error) => {
            this.error = error;
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onCancel(): void {
    this.formCanceled.emit();
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.tripForm.controls).forEach(key => {
      this.tripForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tripForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.tripForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        switch (fieldName) {
          case 'code': return 'Code must be 5-10 uppercase letters/numbers';
          case 'length': return 'Length must be in format "X days"';
          case 'perPerson': return 'Price must be a valid number';
          default: return `${fieldName} format is invalid`;
        }
      }
    }
    return '';
  }
}