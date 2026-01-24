import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ChargingStationService } from '../../../core/services/charging-station.service';
import { ChargingStationRequest } from '../../../core/models/charging-station.model';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';

@Component({
  selector: 'app-add-station',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.scss']
})
export class AddStationComponent {
  stationForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Jours de la semaine (correspond au backend)
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private fb: FormBuilder,
    private chargingStationService: ChargingStationService,
    private router: Router
  ) {
    this.stationForm = this.fb.group({
      // Informations générales
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      hourlyPrice: ['', [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      chargingPowerKw: ['', [Validators.required, Validators.min(0.1), Validators.max(350)]],
      instruction: ['', [Validators.maxLength(500)]],
      hasStand: [false],
      mediaUrl: ['', [Validators.maxLength(512)]],
      
      // Adresse (avec le champ 'number' requis)
      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', Validators.required],  // ⚠️ Champ requis par le backend
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['France', Validators.required]  // Valeur par défaut
      }),
      
      // Localisation GPS
      location: this.fb.group({
        latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
        longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
      }),
      
      // Disponibilités (optionnel)
      availabilities: this.fb.array([])
    });
  }

  /**
   * Getter pour accéder au FormArray des disponibilités
   */
  get availabilities(): FormArray {
    return this.stationForm.get('availabilities') as FormArray;
  }

  /**
   * Ajoute une nouvelle plage horaire de disponibilité
   */
  addAvailability() {
    const availabilityGroup = this.fb.group({
      day: ['MONDAY', Validators.required],
      startTime: ['08:00', Validators.required],
      endTime: ['18:00', Validators.required]
    });
    this.availabilities.push(availabilityGroup);
  }

  /**
   * Supprime une plage horaire
   */
  removeAvailability(index: number) {
    this.availabilities.removeAt(index);
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  private markAllAsTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  /**
   * Soumet le formulaire
   */
  onSubmit() {
    // Validation du formulaire
    if (this.stationForm.invalid) {
      this.error.set('Veuillez remplir tous les champs obligatoires correctement.');
      this.markAllAsTouched(this.stationForm);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.stationForm.value;
    
    // Préparer la requête pour le backend
    const requestDto: ChargingStationRequest = {
      name: formValue.name,
      hourlyPrice: parseFloat(formValue.hourlyPrice),
      chargingPowerKw: parseFloat(formValue.chargingPowerKw),
      instruction: formValue.instruction || undefined,
      hasStand: formValue.hasStand || false,
      mediaUrl: formValue.mediaUrl || undefined,
      address: {
        street: formValue.address.street,
        number: formValue.address.number,
        city: formValue.address.city,
        postalCode: formValue.address.postalCode,
        country: formValue.address.country
      },
      location: {
        latitude: parseFloat(formValue.location.latitude),
        longitude: parseFloat(formValue.location.longitude)
      },
      availabilities: formValue.availabilities.length > 0 
        ? formValue.availabilities 
        : undefined
    };

    console.log('📤 Envoi de la station:', requestDto);

    this.chargingStationService.createStation(requestDto).subscribe({
      next: (response) => {
        console.log('✅ Station créée avec succès:', response);
        this.success.set(true);
        this.loading.set(false);
        
        // Redirection après 1.5 secondes
        setTimeout(() => {
          this.router.navigate(['/stations']);
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création:', err);
        this.loading.set(false);
        
        // Gestion des différents types d'erreurs
        if (err.status === 401) {
          this.error.set('Vous devez être connecté pour ajouter une station.');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 403) {
          this.error.set('Vous n\'avez pas les permissions nécessaires. Seuls les propriétaires (OWNER) peuvent ajouter des stations.');
        } else if (err.error?.message) {
          this.error.set(err.error.message);
        } else {
          this.error.set('Erreur lors de la création de la station. Veuillez réessayer.');
        }
      }
    });
  }

  /**
   * Annule et retourne à la liste des stations
   */
  cancel() {
    this.router.navigate(['/stations']);
  }
}