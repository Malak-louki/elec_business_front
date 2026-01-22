import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss'
})
export class StationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stationService = inject(ChargingStationService);

  stationForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  stationId: string | null = null;

  constructor() {
    this.stationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['France'],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      chargingPowerKw: ['', [Validators.required, Validators.min(3), Validators.max(350)]],
      hourlyPrice: ['', [Validators.required, Validators.min(0.1), Validators.max(999.99)]],
      instruction: ['', [Validators.maxLength(500)]],
      hasStand: [false]
    });
  }

  ngOnInit(): void {
    this.stationId = this.route.snapshot.paramMap.get('id');
    if (this.stationId) {
      this.isEditMode = true;
      this.loadStation(this.stationId);
    }
  }

  loadStation(id: string): void {
    this.isLoading = true;
    this.stationService.getStationById(id).subscribe({
      next: (station) => {
        this.stationForm.patchValue({
          name: station.name,
          street: station.address.street,
          city: station.address.city,
          postalCode: station.address.postalCode,
          country: station.address.country || 'France',
          latitude: station.location.latitude,
          longitude: station.location.longitude,
          chargingPowerKw: station.chargingPowerKw,
          hourlyPrice: station.hourlyPrice,
          instruction: station.instruction,
          hasStand: station.hasStand
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la borne';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.stationForm.invalid) {
      this.stationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = {
      name: this.stationForm.value.name,
      hourlyPrice: this.stationForm.value.hourlyPrice,
      chargingPowerKw: this.stationForm.value.chargingPowerKw,
      instruction: this.stationForm.value.instruction,
      hasStand: this.stationForm.value.hasStand,
      address: {
        street: this.stationForm.value.street,
        city: this.stationForm.value.city,
        postalCode: this.stationForm.value.postalCode,
        country: this.stationForm.value.country
      },
      location: {
        latitude: this.stationForm.value.latitude,
        longitude: this.stationForm.value.longitude
      }
    };

    const observable = this.isEditMode && this.stationId
      ? this.stationService.updateStation(this.stationId, formData)
      : this.stationService.createStation(formData);

    observable.subscribe({
      next: (response) => {
        this.successMessage = this.isEditMode 
          ? 'Borne modifiée avec succès !'
          : 'Borne créée avec succès !';
        
        setTimeout(() => {
          this.router.navigate(['/stations', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de l\'enregistrement';
        console.error('Erreur:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getCoordinatesFromAddress(): void {
    const street = this.stationForm.get('street')?.value;
    const city = this.stationForm.get('city')?.value;
    const postalCode = this.stationForm.get('postalCode')?.value;

    if (!street || !city || !postalCode) {
      alert('Veuillez remplir l\'adresse complète d\'abord');
      return;
    }

    // Pour l'instant, on met des valeurs par défaut (France)
    this.stationForm.patchValue({
      latitude: 48.8566,
      longitude: 2.3522
    });

    alert('Coordonnées GPS définies (valeur par défaut). Dans une vraie app, on utiliserait une API de géocodage.');
  }

  get name() { return this.stationForm.get('name'); }
  get street() { return this.stationForm.get('street'); }
  get city() { return this.stationForm.get('city'); }
  get postalCode() { return this.stationForm.get('postalCode'); }
  get latitude() { return this.stationForm.get('latitude'); }
  get longitude() { return this.stationForm.get('longitude'); }
  get chargingPowerKw() { return this.stationForm.get('chargingPowerKw'); }
  get hourlyPrice() { return this.stationForm.get('hourlyPrice'); }
  get instruction() { return this.stationForm.get('instruction'); }
}