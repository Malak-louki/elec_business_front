import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  BookingRequest, 
  BookingResponse,
  AvailabilityRequest,
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
    return this.http.get<BookingResponse[]>(`${this.API_URL}/my-bookings`);
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
   */
  checkAvailability(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    const params = new HttpParams()
      .set('stationId', request.stationId)
      .set('startDateTime', request.startDateTime)
      .set('endDateTime', request.endDateTime);

    return this.http.get<AvailabilityResponse>(`${this.API_URL}/check-availability`, { params });
  }

  /**
   * Calcule la durée en heures entre deux dates
   */
  calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60)); // Arrondi supérieur
  }

  /**
   * Calcule le montant total
   */
  calculateTotalAmount(pricePerHour: number, start: string, end: string): number {
    const hours = this.calculateDuration(start, end);
    return hours * pricePerHour;
  }
}