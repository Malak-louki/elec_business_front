import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentRequest } from '../../../core/models/payment.model';
import { BookingResponse } from '../../../core/models/booking.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './booking-payment.component.html',
  styleUrl: './booking-payment.component.scss'
})
export class BookingPaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private bookingService = inject(BookingService);

  booking: BookingResponse | null = null;
  isLoading = true;
  isProcessing = false;
  errorMessage = '';
  successMessage = '';

  selectedPaymentMethod = 'card';
  paymentMethods = [
    { value: 'card', label: 'Carte bancaire', icon: '💳' },
    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
    { value: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
    { value: 'google_pay', label: 'Google Pay', icon: '🔵' }
  ];

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.loadBooking(bookingId);
    }
  }

  loadBooking(id: string): void {
    this.isLoading = true;
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        
        // Vérifier que la réservation est bien PENDING
        if (booking.bookingStatus !== 'PENDING') {
          this.errorMessage = 'Cette réservation n\'est pas en attente de paiement';
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la réservation';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  processPayment(simulateSuccess: boolean = true): void {
    if (!this.booking) return;

    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: PaymentRequest = {
      bookingId: this.booking.id,
      paymentMethod: this.selectedPaymentMethod,
      simulateSuccess: simulateSuccess
    };

    this.paymentService.simulatePayment(request).subscribe({
      next: (response) => {
        if (response.paymentStatus === 'SUCCEEDED') {
          this.successMessage = 'Paiement réussi ! Votre réservation est confirmée.';
          setTimeout(() => {
            this.router.navigate(['/bookings']);
          }, 2000);
        } else {
          this.errorMessage = 'Le paiement a échoué. Veuillez réessayer.';
          this.isProcessing = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du paiement';
        this.isProcessing = false;
        console.error('Erreur:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}