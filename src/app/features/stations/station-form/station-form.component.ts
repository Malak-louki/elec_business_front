import { NavbarComponent } from './../../../shared/layout/navbar/navbar.component';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationRequest, ChargingStationResponse } from '../../../core/models/charging-station.model';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss']
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  isEditMode = false;
  stationId?: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stationService: ChargingStationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      chargingPowerKw: ['', [Validators.required, Validators.min(3), Validators.max(350)]],
      hourlyPrice: ['', [Validators.required, Validators.min(0.1), Validators.max(999.99)]],
      instruction: ['', [Validators.maxLength(500)]],
      hasStand: [false],
      // Champs cachés pour correspondre au modèle backend
      address: this.fb.group({
        street: [''],
        number: ['1'],  // Valeur par défaut
        city: [''],
        postalCode: [''],
        country: ['France']
      }),
      location: this.fb.group({
        latitude: [''],
        longitude: ['']
      })
    });
  }

  // ========================================
  // GETTERS POUR LE TEMPLATE HTML
  // ========================================

  get name() {
    return this.stationForm.get('name');
  }

  get street() {
    return this.stationForm.get('street');
  }

  get city() {
    return this.stationForm.get('city');
  }

  get postalCode() {
    return this.stationForm.get('postalCode');
  }

  get latitude() {
    return this.stationForm.get('latitude');
  }

  get longitude() {
    return this.stationForm.get('longitude');
  }

  get chargingPowerKw() {
    return this.stationForm.get('chargingPowerKw');
  }

  get hourlyPrice() {
    return this.stationForm.get('hourlyPrice');
  }

  get instruction() {
    return this.stationForm.get('instruction');
  }

  get isLoading() {
    return this.loading();
  }

  // ========================================
  // LIFECYCLE
  // ========================================

  ngOnInit(): void {
    this.stationId = this.route.snapshot.params['id'];
    if (this.stationId) {
      this.isEditMode = true;
      this.loadStation();
    }
  }

  // ========================================
  // MÉTHODES
  // ========================================

  loadStation(): void {
    if (!this.stationId) return;

    this.loading.set(true);
    this.stationService.getStationById(this.stationId).subscribe({
      next: (station: ChargingStationResponse) => {
        // Charger les valeurs dans les champs visibles
        this.stationForm.patchValue({
          name: station.name,
          street: station.address.street,
          city: station.address.city,
          postalCode: station.address.postalCode,
          latitude: station.location.latitude,
          longitude: station.location.longitude,
          chargingPowerKw: station.chargingPowerKw,
          hourlyPrice: station.hourlyPrice,
          instruction: station.instruction,
          hasStand: station.hasStand
        });
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement de la station';
        this.loading.set(false);
      }
    });
  }

  /**
   * Obtenir les coordonnées GPS depuis l'adresse (simulation)
   * Dans un vrai projet, utiliser l'API Google Maps Geocoding
   */
  getCoordinatesFromAddress(): void {
    const street = this.stationForm.get('street')?.value;
    const city = this.stationForm.get('city')?.value;
    const postalCode = this.stationForm.get('postalCode')?.value;

    if (!street || !city || !postalCode) {
      alert('Veuillez remplir l\'adresse complète d\'abord');
      return;
    }

    // Simulation - Dans un vrai projet, appeler l'API Google Maps
    // Exemple: Paris = 48.8566, 2.3522
    alert('⚠️ Fonctionnalité à implémenter avec Google Maps API\n\nPour l\'instant, veuillez entrer les coordonnées manuellement.\n\nAstuce: Vous pouvez trouver les coordonnées GPS sur Google Maps.');
    
    // Exemple d'implémentation avec Google Maps:
    // const address = `${street}, ${postalCode} ${city}, France`;
    // this.geocodeService.getCoordinates(address).subscribe(coords => {
    //   this.stationForm.patchValue({
    //     latitude: coords.lat,
    //     longitude: coords.lng
    //   });
    // });
  }

  onSubmit(): void {
    if (this.stationForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      this.markFormGroupTouched(this.stationForm);
      return;
    }

    this.loading.set(true);
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.stationForm.value;
    
    // Préparer les données pour le backend
    const formData: ChargingStationRequest = {
      name: formValue.name,
      hourlyPrice: parseFloat(formValue.hourlyPrice),
      chargingPowerKw: parseFloat(formValue.chargingPowerKw),
      instruction: formValue.instruction || undefined,
      hasStand: formValue.hasStand || false,
      address: {
        street: formValue.street,
        number: '1',  // Valeur par défaut car non demandée dans le formulaire
        city: formValue.city,
        postalCode: formValue.postalCode,
        country: 'France'
      },
      location: {
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude)
      }
    };

    const request = this.isEditMode && this.stationId
      ? this.stationService.updateStation(this.stationId, formData)
      : this.stationService.createStation(formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage = this.isEditMode 
          ? 'Station modifiée avec succès !' 
          : 'Station créée avec succès !';
        
        setTimeout(() => {
          this.router.navigate(['/stations']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMessage = err.error?.message || 'Erreur lors de la sauvegarde';
        console.error('Error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/stations']);
  }

  /**
   * Marque tous les champs du formulaire comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}