import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChargingStationRequest,
  ChargingStationResponse
} from '../models/charging-station.model';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/charging-stations`;

  /**
   * Get all available charging stations
   * GET /api/charging-stations
   */
  getAvailableStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(this.API_URL);
  }

  /**
   * Get charging station by id
   * GET /api/charging-stations/{id}
   */
  getStationById(id: string): Observable<ChargingStationResponse> {
    return this.http.get<ChargingStationResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Get stations owned by current user
   * GET /api/charging-stations/mine
   */
  getMyStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(`${this.API_URL}/mine`);
  }

    getAllStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(`${this.API_URL}/charging-stations`);
  }

  /**
   * Get stations by city
   * GET /api/charging-stations/city/{city}
   */
  getStationsByCity(city: string): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(
      `${this.API_URL}/city/${city}`
    );
  }

  /**
   * Advanced search
   * GET /api/charging-stations/search
   */
  searchStations(
    city?: string,
    maxPrice?: number,
    minPowerKw?: number
  ): Observable<ChargingStationResponse[]> {

    let params = new HttpParams();

    if (city) {
      params = params.set('city', city);
    }
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (minPowerKw !== undefined) {
      params = params.set('minPowerKw', minPowerKw.toString());
    }

    return this.http.get<ChargingStationResponse[]>(
      `${this.API_URL}/search`,
      { params }
    );
  }

  /**
   * Create charging station (OWNER)
   * POST /api/charging-stations
   */
  createStation(
    request: ChargingStationRequest
  ): Observable<ChargingStationResponse> {
    return this.http.post<ChargingStationResponse>(this.API_URL, request);
  }

  /**
   * Update charging station (OWNER)
   * PUT /api/charging-stations/{id}
   */
  updateStation(
    id: string,
    request: ChargingStationRequest
  ): Observable<ChargingStationResponse> {
    return this.http.put<ChargingStationResponse>(
      `${this.API_URL}/${id}`,
      request
    );
  }

  /**
   * Delete charging station (OWNER)
   * DELETE /api/charging-stations/{id}
   */
  deleteStation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}