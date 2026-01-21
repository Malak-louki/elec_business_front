import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { PowerType } from '../../../core/models/charging-station.model';
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

  powerTypes = Object.values(PowerType);

  constructor() {
    this.stationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      powerType: [PowerType.AC, [Validators.required]],
      maxPower: ['', [Validators.required, Validators.min(3), Validators.max(350)]],
      pricePerHour: ['', [Validators.required, Validators.min(0.1), Validators.max(100)]],
      description: ['', [Validators.maxLength(500)]]
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
          address: station.address,
          city: station.city,
          postalCode: station.postalCode,
          latitude: station.latitude,
          longitude: station.longitude,
          powerType: station.powerType,
          maxPower: station.maxPower,
          pricePerHour: station.pricePerHour,
          description: station.description
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

    const formData = this.stationForm.value;

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

  // Méthode helper pour obtenir les coordonnées GPS de l'adresse
  getCoordinatesFromAddress(): void {
    const address = this.stationForm.get('address')?.value;
    const city = this.stationForm.get('city')?.value;
    const postalCode = this.stationForm.get('postalCode')?.value;

    if (!address || !city || !postalCode) {
      alert('Veuillez remplir l\'adresse complète d\'abord');
      return;
    }

    // Pour l'instant, on met des valeurs par défaut (France)
    // Dans une vraie app, on utiliserait une API de géocodage
    this.stationForm.patchValue({
      latitude: 48.8566,
      longitude: 2.3522
    });

    alert('Coordonnées GPS définies (valeur par défaut). Dans une vraie app, on utiliserait une API de géocodage.');
  }

  get name() { return this.stationForm.get('name'); }
  get address() { return this.stationForm.get('address'); }
  get city() { return this.stationForm.get('city'); }
  get postalCode() { return this.stationForm.get('postalCode'); }
  get latitude() { return this.stationForm.get('latitude'); }
  get longitude() { return this.stationForm.get('longitude'); }
  get powerType() { return this.stationForm.get('powerType'); }
  get maxPower() { return this.stationForm.get('maxPower'); }
  get pricePerHour() { return this.stationForm.get('pricePerHour'); }
  get description() { return this.stationForm.get('description'); }
}