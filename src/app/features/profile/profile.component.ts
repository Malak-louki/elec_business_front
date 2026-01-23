import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth.service';
import { UserService } from '../../../app/core/services/user.service';
import { NavbarComponent } from '../../../app/shared/layout/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showUpgradeConfirm = signal(false);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    console.log('📊 Current user data:', user);
    console.log('📊 User status (raw):', user?.userStatus);
    console.log('📊 User status (type):', typeof user?.userStatus);
  }

  /**
   * Demande de confirmation avant de passer OWNER
   */
  requestUpgradeToOwner(): void {
    this.showUpgradeConfirm.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  /**
   * Annule la demande de passage OWNER
   */
  cancelUpgrade(): void {
    this.showUpgradeConfirm.set(false);
  }

  /**
   * Confirme et effectue le passage en OWNER
   */
  confirmUpgradeToOwner(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.userService.upgradeToOwner().subscribe({
      next: (response) => {
        console.log('✅ Upgrade successful:', response);

        this.successMessage.set(
          'Votre compte a été mis à niveau vers OWNER ! Vous pouvez maintenant ajouter des bornes.',
        );
        this.showUpgradeConfirm.set(false);
        this.isLoading.set(false);

        // Demander à l'utilisateur de se reconnecter pour rafraîchir les rôles
        setTimeout(() => {
          if (
            confirm(
              'Pour que les changements prennent effet, vous devez vous reconnecter. Voulez-vous vous reconnecter maintenant ?',
            )
          ) {
            this.authService.logout();
          } else {
            // Recharger la page pour mettre à jour l'interface
            window.location.reload();
          }
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Erreur upgrade:', error);

        let errorMsg = 'Erreur lors de la mise à niveau du compte';

        if (error.status === 401) {
          errorMsg = 'Vous devez être connecté pour effectuer cette action';
        } else if (error.status === 403) {
          errorMsg = "Vous n'avez pas les permissions nécessaires";
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }

        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
        this.showUpgradeConfirm.set(false);
      },
    });
  }

  /**
   * Vérifie si l'utilisateur peut devenir OWNER
   */
  canUpgradeToOwner(): boolean {
    return (
      this.authService.isAuthenticated() &&
      !this.authService.isOwner() &&
      !this.authService.isAdmin()
    );
  }

  /**
   * Retourne le libellé français du rôle
   */
  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      USER: 'Utilisateur',
      OWNER: 'Propriétaire',
      ADMIN: 'Administrateur',
    };
    return roleLabels[role] || role;
  }

  /**
   * Retourne la classe CSS pour le badge du rôle
   */
  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      USER: 'bg-blue-100 text-blue-800',
      OWNER: 'bg-green-100 text-green-800',
      ADMIN: 'bg-purple-100 text-purple-800',
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Retourne le libellé du statut utilisateur
   * ✨ VERSION FINALE : Compatible avec tous les formats possibles
   */
  getUserStatusLabel(): string {
    const rawStatus = this.authService.currentUser()?.userStatus;

    // Si pas de statut, retourner "Inconnu"
    if (!rawStatus) {
      console.warn('⚠️ No user status found');
      return 'Inconnu';
    }

    // Convertir en string et en majuscules pour normaliser
    const normalizedStatus = String(rawStatus).toUpperCase().trim();

    console.log('🔍 Status detection:', {
      raw: rawStatus,
      type: typeof rawStatus,
      normalized: normalizedStatus,
    });

    const labels: { [key: string]: string } = {
      ACTIVE: 'Actif',
      PENDING: 'En attente de validation',
      SUSPENDED: 'Suspendu',
      BANNED: 'Banni',
    };

    // Retourner le libellé ou la valeur brute si non trouvé
    const label = labels[normalizedStatus];

    if (!label) {
      console.warn('⚠️ Unknown status:', normalizedStatus);
    }

    return label || String(rawStatus);
  }

  /**
   * Retourne la classe CSS pour le statut
   * ✨ VERSION FINALE : Compatible avec tous les formats possibles
   */
  getUserStatusClass(): string {
    const rawStatus = this.authService.currentUser()?.userStatus;

    if (!rawStatus) {
      return 'text-gray-600';
    }

    // Normaliser le statut
    const normalizedStatus = String(rawStatus).toUpperCase().trim();

    const classes: { [key: string]: string } = {
      ACTIVE: 'text-green-600',
      PENDING: 'text-yellow-600',
      SUSPENDED: 'text-red-600',
      BANNED: 'text-red-800',
    };

    return classes[normalizedStatus] || 'text-gray-600';
  }
}
