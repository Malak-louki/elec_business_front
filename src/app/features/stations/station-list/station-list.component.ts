import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationResponse } from '../../../core/models/charging-station.model';
import { AuthService } from '../../../core/services/auth.service'; 
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component'; 
import { StationCardComponent } from '../station-card/station-card.component'; 

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, StationCardComponent], 
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {
  private stationService = inject(ChargingStationService);
  authService = inject(AuthService); 

  stations = signal<ChargingStationResponse[]>([]);
  isLoading = signal(false); 
  errorMessage = signal<string | null>(null); 
  searchCity = '';

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.stationService.getAvailableStations().subscribe({
      next: (stations: ChargingStationResponse[]) => {
        this.stations.set(stations);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Erreur lors du chargement des stations');
        this.isLoading.set(false);
        console.error('Error loading stations:', error);
      }
    });
  }

  searchStations(): void {
    if (!this.searchCity.trim()) {
      this.loadStations();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.stationService.getStationsByCity(this.searchCity.trim()).subscribe({
      next: (stations: ChargingStationResponse[]) => {
        this.stations.set(stations);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Erreur lors de la recherche');
        this.isLoading.set(false);
        console.error('Error searching stations:', error);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchCity = input.value;
  }

  clearSearch(): void {
    this.searchCity = '';
    this.loadStations();
  }

  deleteStation(stationId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      return;
    }

    this.isLoading.set(true);
    this.stationService.deleteStation(stationId).subscribe({
      next: () => {
        this.loadStations();
      },
      error: (error: any) => {
        this.errorMessage.set('Erreur lors de la suppression');
        this.isLoading.set(false);
        console.error('Error deleting station:', error);
      }
    });
  }
}