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
   * Récupère toutes les stations
   */
  getAllStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(this.API_URL);
  }

  /**
   * Récupère une station par ID
   */
  getStationById(id: string): Observable<ChargingStationResponse> {
    return this.http.get<ChargingStationResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Récupère les stations d'un propriétaire
   */
  getMyStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(`${this.API_URL}/my-stations`);
  }

  /**
   * Recherche des stations par ville
   */
  searchByCity(city: string): Observable<ChargingStationResponse[]> {
    const params = new HttpParams().set('city', city);
    return this.http.get<ChargingStationResponse[]>(`${this.API_URL}/search`, { params });
  }

  /**
   * Recherche des stations disponibles
   */
  getAvailableStations(): Observable<ChargingStationResponse[]> {
    return this.http.get<ChargingStationResponse[]>(`${this.API_URL}/available`);
  }

  /**
   * Crée une nouvelle station (OWNER)
   */
  createStation(request: ChargingStationRequest): Observable<ChargingStationResponse> {
    return this.http.post<ChargingStationResponse>(this.API_URL, request);
  }

  /**
   * Met à jour une station (OWNER)
   */
  updateStation(id: string, request: ChargingStationRequest): Observable<ChargingStationResponse> {
    return this.http.put<ChargingStationResponse>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Supprime une station (OWNER)
   */
  deleteStation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}