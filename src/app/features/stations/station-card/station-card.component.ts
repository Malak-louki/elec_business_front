import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChargingStationResponse } from '../../../core/models/charging-station.model';

@Component({
  selector: 'app-station-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss'
})
export class StationCardComponent {
  @Input({ required: true }) station!: ChargingStationResponse;

  getStatusColor(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-red-100 text-red-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'Disponible';
      case 'OCCUPIED': return 'Occupée';
      case 'MAINTENANCE': return 'Maintenance';
      default: return status;
    }
  }

  getPowerTypeIcon(powerType: string): string {
    return powerType === 'DC' ? '⚡' : '🔌';
  }
}