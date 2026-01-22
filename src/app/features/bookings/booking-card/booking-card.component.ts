import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingResponse } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.scss'
})
export class BookingCardComponent {
  @Input({ required: true }) booking!: BookingResponse;
  @Output() bookingCancelled = new EventEmitter<string>();

  private bookingService = inject(BookingService);
  isCancelling = false;

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmée';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      case 'EXPIRED': return 'Expirée';
      default: return status;
    }
  }

  canCancel(): boolean {
    return this.booking.bookingStatus === 'PENDING' || 
           this.booking.bookingStatus === 'CONFIRMED';
  }

  cancelBooking(): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    this.isCancelling = true;
    this.bookingService.cancelBooking(this.booking.id).subscribe({
      next: () => {
        this.bookingCancelled.emit(this.booking.id);
      },
      error: (error) => {
        this.isCancelling = false;
        alert('Erreur lors de l\'annulation');
        console.error('Erreur:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getDuration(): string {
    const hours = this.bookingService.calculateDuration(
      this.booking.startDateTime,
      this.booking.endDateTime
    );
    return `${hours}h`;
  }
}