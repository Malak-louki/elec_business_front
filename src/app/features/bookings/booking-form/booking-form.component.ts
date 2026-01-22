import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationResponse } from '../../../core/models/charging-station.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { BookingRequest } from '../../../core/models/booking.model'; 

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public bookingService = inject(BookingService);
  private readonly stationService = inject(ChargingStationService);

  bookingForm: FormGroup;
  station: ChargingStationResponse | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isCheckingAvailability = false;
  isAvailable = false;
  estimatedAmount = 0;

  constructor() {
    // Date/heure minimum : maintenant
    const now = new Date();
    const minDateTime = this.formatDateTimeLocal(now);

    this.bookingForm = this.fb.group({
      startDateTime: ['', [Validators.required, this.minDateValidator.bind(this)]],
      endDateTime: ['', [Validators.required]]
    }, {
      validators: this.dateRangeValidator
    });
  }

  ngOnInit(): void {
    const stationId = this.route.snapshot.paramMap.get('stationId');
    if (stationId) {
      this.loadStation(stationId);
    }

    // Recalculer le montant quand les dates changent
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateEstimatedAmount();
    });
  }

  loadStation(id: string): void {
    this.isLoading = true;
    this.stationService.getStationById(id).subscribe({
      next: (station) => {
        this.station = station;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la station';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  calculateEstimatedAmount(): void {
    if (!this.station || !this.bookingForm.value.startDateTime || !this.bookingForm.value.endDateTime) {
      this.estimatedAmount = 0;
      return;
    }

    this.estimatedAmount = this.bookingService.calculateTotalAmount(
      this.station.hourlyPrice,
      this.bookingForm.value.startDateTime,
      this.bookingForm.value.endDateTime
    );
  }

  checkAvailability(): void {
  if (!this.station || this.bookingForm.invalid) {
    return;
  }

  this.isCheckingAvailability = true;
  this.errorMessage = '';

  // Formater les dates pour le backend
  const startFormatted = this.bookingService.formatDateTimeForBackend(this.bookingForm.value.startDateTime);
  const endFormatted = this.bookingService.formatDateTimeForBackend(this.bookingForm.value.endDateTime);

  this.bookingService.checkAvailability(
    this.station.id,
    startFormatted,
    endFormatted
  ).subscribe({
    next: (response) => {
      this.isAvailable = response.available;
      if (!response.available) {
        this.errorMessage = 'Cette borne n\'est pas disponible pour ces dates';
      } else {
        this.successMessage = 'La borne est disponible !';
        this.calculateEstimatedAmount();
      }
      this.isCheckingAvailability = false;
    },
    error: (error) => {
      this.errorMessage = 'Erreur lors de la vérification de disponibilité';
      this.isCheckingAvailability = false;
      console.error('Erreur:', error);
    }
  });
}

onSubmit(): void {
  if (this.bookingForm.invalid || !this.station || !this.isAvailable) {
    this.bookingForm.markAllAsTouched();
    if (!this.isAvailable) {
      this.errorMessage = 'Veuillez vérifier la disponibilité avant de réserver';
    }
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // Formater les dates pour le backend
  const startFormatted = this.bookingService.formatDateTimeForBackend(this.bookingForm.value.startDateTime);
  const endFormatted = this.bookingService.formatDateTimeForBackend(this.bookingForm.value.endDateTime);

  const request: BookingRequest = {
    chargingStationId: this.station.id,
    startDateTime: startFormatted,
    endDateTime: endFormatted
  };

  this.bookingService.createBooking(request).subscribe({
    next: (response) => {
      this.successMessage = 'Réservation créée avec succès !';
      setTimeout(() => {
        this.router.navigate(['/bookings/payment', response.id]);
      }, 1500);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Erreur lors de la réservation';
      console.error('Erreur:', error);
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  // Validators
  minDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const now = new Date();
    return selectedDate < now ? { minDate: true } : null;
  }

  dateRangeValidator(form: FormGroup) {
    const start = form.get('startDateTime')?.value;
    const end = form.get('endDateTime')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      return { dateRange: true };
    }

    return null;
  }

  // Helper pour formater datetime-local
  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  get startDateTime() { return this.bookingForm.get('startDateTime'); }
  get endDateTime() { return this.bookingForm.get('endDateTime'); }
}