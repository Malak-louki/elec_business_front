import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationResponse } from '../../../core/models/charging-station.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-station-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './station-detail.component.html',
  styleUrl: './station-detail.component.scss'
})
export class StationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stationService = inject(ChargingStationService);
  authService = inject(AuthService);

  station: ChargingStationResponse | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStation(id);
    }
  }

  loadStation(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.stationService.getStationById(id).subscribe({
      next: (station) => {
        this.station = station;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la station';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  deleteStation(): void {
    if (!this.station) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette borne ?')) {
      this.stationService.deleteStation(this.station.id).subscribe({
        next: () => {
          this.router.navigate(['/stations']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression';
          console.error('Erreur:', error);
        }
      });
    }
  }

  canEdit(): boolean {
    if (!this.station || !this.station.owner) return false;
    const currentUser = this.authService.currentUser();
    return (
      currentUser?.id === this.station.owner.id || 
      this.authService.isAdmin()
    );
  }
}