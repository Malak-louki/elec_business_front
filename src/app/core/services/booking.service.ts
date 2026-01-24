import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  BookingRequest, 
  BookingResponse,
  AvailabilityResponse
} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/bookings`;

  /**
   * Crée une nouvelle réservation
   */
  createBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.API_URL, request);
  }

  /**
   * Récupère toutes les réservations de l'utilisateur connecté
   */
  getMyBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.API_URL}/my`);
  }

  /**
   * Récupère une réservation par ID
   */
  getBookingById(id: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Annule une réservation
   */
  cancelBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Vérifie la disponibilité d'une station
   * GET /api/bookings/availability?stationId=xxx&start=2024-01-15T10:00:00&end=2024-01-15T12:00:00
   */
  checkAvailability(stationId: string, start: string, end: string): Observable<AvailabilityResponse> {
    const params = new HttpParams()
      .set('stationId', stationId)
      .set('start', start)
      .set('end', end);

    return this.http.get<AvailabilityResponse>(`${this.API_URL}/availability`, { params });
  }

  /**
   * Calcule la durée en heures entre deux dates
   */
  calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }

  /**
   * Calcule le montant total
   */
  calculateTotalAmount(pricePerHour: number, start: string, end: string): number {
    const hours = this.calculateDuration(start, end);
    return hours * pricePerHour;
  }

  /**
   * Formate une date pour l'API backend (ISO 8601)
   * Input: "2024-01-15T10:30" (datetime-local)
   * Output: "2024-01-15T10:30:00"
   */
  formatDateTimeForBackend(dateTimeLocal: string): string {
    if (!dateTimeLocal) return '';
    // Ajouter les secondes si elles ne sont pas présentes
    return dateTimeLocal.includes(':00:00') ? dateTimeLocal : `${dateTimeLocal}:00`;
  }
  // booking.service.ts ou dans ton composant
validateBookingDuration(start: Date, end: Date): { valid: boolean; error?: string } {
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  if (durationHours < 1) {
    return { 
      valid: false, 
      error: 'La durée minimale de réservation est de 1 heure' 
    };
  }
  
  if (durationHours > 168) {  // 7 jours × 24h
    return { 
      valid: false, 
      error: 'La durée maximale de réservation est de 7 jours (168 heures)' 
    };
  }
  
  return { valid: true };
}
}