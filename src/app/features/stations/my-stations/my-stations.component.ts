import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChargingStation } from '../../../core/models/charging-station.model';
import { ChargingStationService } from '../../../core/services/charging-station.service';

@Component({
  selector: 'app-my-stations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-stations.component.html',
  styleUrl: './my-stations.component.scss'
})
export class MyStationsComponent implements OnInit {
  myStations: ChargingStation[] = [];
  loading = false;

  constructor(
    private chargingStationService: ChargingStationService
  ) {}

  ngOnInit() {
    this.loadMyStations();
  }

  loadMyStations() {
    this.loading = true;
    this.chargingStationService.getMyStations().subscribe({
      next: (stations) => {
        this.myStations = stations;

        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement:', error);
        this.loading = false;
      }
    });
  }

  deleteStation(stationId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette borne ?')) {
      this.chargingStationService.deleteStation(stationId).subscribe({
        next: () => {
          this.loadMyStations(); // Recharger la liste
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la borne');
        }
      });
    }
  }
}