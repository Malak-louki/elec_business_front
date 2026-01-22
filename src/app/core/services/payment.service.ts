import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/payments`;

  /**
   * Simule un paiement pour une réservation
   */
  simulatePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API_URL}/simulate`, request);
  }

  /**
   * Récupère les détails d'un paiement
   */
  getPaymentById(id: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Rembourse un paiement
   */
  refundPayment(id: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API_URL}/${id}/refund`, {});
  }
}