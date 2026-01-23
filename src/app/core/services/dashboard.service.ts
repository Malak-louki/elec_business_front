import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OwnerDashboardStats,
  StationPerformance,
  RevenueAnalytics,
  StationBookingHistory
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/owner/dashboard`;

  /**
   * Récupère les statistiques globales du propriétaire
   * GET /api/owner/dashboard/stats
   */
  getOwnerStats(): Observable<OwnerDashboardStats> {
    return this.http.get<OwnerDashboardStats>(`${this.API_URL}/stats`);
  }

  /**
   * Récupère les performances de toutes les bornes
   * GET /api/owner/dashboard/stations/performance
   */
  getAllStationsPerformance(): Observable<StationPerformance[]> {
    return this.http.get<StationPerformance[]>(`${this.API_URL}/stations/performance`);
  }

  /**
   * Récupère les performances d'une borne spécifique
   * GET /api/owner/dashboard/stations/{stationId}/performance
   */
  getStationPerformance(stationId: string): Observable<StationPerformance> {
    return this.http.get<StationPerformance>(`${this.API_URL}/stations/${stationId}/performance`);
  }

  /**
   * Récupère le top N des bornes par revenu
   * GET /api/owner/dashboard/stations/top?limit=N
   */
  getTopStationsByRevenue(limit: number = 5): Observable<StationPerformance[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<StationPerformance[]>(`${this.API_URL}/stations/top`, { params });
  }

  /**
   * Récupère les analytics de revenus sur une période
   * GET /api/owner/dashboard/revenue/analytics?startDate=...&endDate=...
   */
  getRevenueAnalytics(startDate: string, endDate: string): Observable<RevenueAnalytics> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<RevenueAnalytics>(`${this.API_URL}/revenue/analytics`, { params });
  }

  /**
   * Récupère l'historique des réservations d'une borne
   * GET /api/owner/dashboard/stations/{stationId}/bookings
   */
  getStationBookingHistory(stationId: string): Observable<StationBookingHistory> {
    return this.http.get<StationBookingHistory>(`${this.API_URL}/stations/${stationId}/bookings`);
  }
}