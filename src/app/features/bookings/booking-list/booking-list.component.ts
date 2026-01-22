import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse, BookingStatus } from '../../../core/models/booking.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { BookingCardComponent } from '../booking-card/booking-card.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, BookingCardComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: BookingResponse[] = [];
  filteredBookings: BookingResponse[] = [];
  isLoading = true;
  errorMessage = '';
  
  selectedStatus: string = 'ALL';
  bookingStatuses = ['ALL', ...Object.values(BookingStatus)];

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des réservations';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    
    if (status === 'ALL') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(
        booking => booking.bookingStatus === status
      );
    }
  }

  onBookingCancelled(bookingId: string): void {
    // Recharger la liste après annulation
    this.loadBookings();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ALL': return 'Toutes';
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmées';
      case 'COMPLETED': return 'Terminées';
      case 'CANCELLED': return 'Annulées';
      case 'EXPIRED': return 'Expirées';
      default: return status;
    }
  }

  getStatusCount(status: string): number {
    if (status === 'ALL') {
      return this.bookings.length;
    }
    return this.bookings.filter(b => b.bookingStatus === status).length;
  }
}