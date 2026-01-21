import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationResponse } from '../../../core/models/charging-station.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { StationCardComponent } from '../station-card/station-card.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, StationCardComponent],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss'
})
export class StationListComponent implements OnInit {
  private stationService = inject(ChargingStationService);
  authService = inject(AuthService);

  stations: ChargingStationResponse[] = [];
  isLoading = true;
  errorMessage = '';
  searchCity = '';

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.stationService.getAllStations().subscribe({
      next: (stations) => {
        this.stations = stations;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des stations';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  searchStations(): void {
    if (!this.searchCity.trim()) {
      this.loadStations();
      return;
    }

    this.isLoading = true;
    this.stationService.searchByCity(this.searchCity).subscribe({
      next: (stations) => {
        this.stations = stations;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la recherche';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchCity = input.value;
  }
}