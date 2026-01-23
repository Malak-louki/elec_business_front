import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../app/core/services/dashboard.service';
import { NavbarComponent } from '../../../app/shared/layout/navbar/navbar.component';
import {
  OwnerDashboardStats,
  StationPerformance,
  RevenueAnalytics
} from '../../../app/core/models/dashboard.model';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Signals pour les données
  stats = signal<OwnerDashboardStats | null>(null);
  topStations = signal<StationPerformance[]>([]);
  revenueAnalytics = signal<RevenueAnalytics | null>(null);
  
  // Signals pour l'état
  isLoadingStats = signal(false);
  isLoadingStations = signal(false);
  isLoadingRevenue = signal(false);
  errorMessage = signal<string | null>(null);

  // Période pour les analytics (30 derniers jours par défaut)
  private readonly DAYS_PERIOD = 30;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Charge toutes les données du dashboard
   */
  loadDashboardData(): void {
    this.loadStats();
    this.loadTopStations();
    this.loadRevenueAnalytics();
  }

  /**
   * Charge les statistiques globales
   */
  loadStats(): void {
    this.isLoadingStats.set(true);
    this.dashboardService.getOwnerStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoadingStats.set(false);
        console.log('📊 Stats loaded:', data);
      },
      error: (error) => {
        console.error('❌ Error loading stats:', error);
        this.errorMessage.set('Erreur lors du chargement des statistiques');
        this.isLoadingStats.set(false);
      }
    });
  }

  /**
   * Charge le top 5 des bornes par revenu
   */
  loadTopStations(): void {
    this.isLoadingStations.set(true);
    this.dashboardService.getTopStationsByRevenue(5).subscribe({
      next: (data) => {
        this.topStations.set(data);
        this.isLoadingStations.set(false);
        console.log('⚡ Top stations loaded:', data);
      },
      error: (error) => {
        console.error('❌ Error loading stations:', error);
        this.isLoadingStations.set(false);
      }
    });
  }

  /**
   * Charge les analytics de revenus (30 derniers jours)
   */
  loadRevenueAnalytics(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - this.DAYS_PERIOD);

    const startDateStr = this.formatDate(startDate);
    const endDateStr = this.formatDate(endDate);

    this.isLoadingRevenue.set(true);
    this.dashboardService.getRevenueAnalytics(startDateStr, endDateStr).subscribe({
      next: (data) => {
        this.revenueAnalytics.set(data);
        this.isLoadingRevenue.set(false);
        console.log('💰 Revenue analytics loaded:', data);
      },
      error: (error) => {
        console.error('❌ Error loading revenue:', error);
        this.isLoadingRevenue.set(false);
      }
    });
  }

  /**
   * Formate une date au format YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formate un nombre en euros
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * Formate un pourcentage
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Retourne la classe CSS selon le statut de disponibilité
   */
  getAvailabilityClass(available: boolean): string {
    return available ? 'text-green-600' : 'text-red-600';
  }

  /**
   * Retourne le libellé de disponibilité
   */
  getAvailabilityLabel(available: boolean): string {
    return available ? 'Disponible' : 'Indisponible';
  }
}