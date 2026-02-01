import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  ValidationResponse 
} from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals pour l'état d'authentification
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  private readonly TOKEN_KEY = 'elec_business_token';
  private readonly USER_KEY = 'elec_business_user';

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Charge l'utilisateur depuis le localStorage au démarrage
   */
  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Erreur lors du chargement utilisateur:', error);
        this.logout();
      }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(
        tap(response => {
          if (response.accessToken) {
            this.saveAuthData(response);
          }
        })
      );
  }

  /**
   * Connexion utilisateur
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          this.saveAuthData(response);
        })
      );
  }

  /**
   * Validation email avec token
   */
validateEmail(code: string): Observable<ValidationResponse> {
  return this.http.get<ValidationResponse>(
    `${environment.apiUrl}/auth/validate`,  
    { params: { code } }
  );
}

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Récupère le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Sauvegarde les données d'authentification
   */
  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      firstName: response.user.username,
      lastName: response.user.lastName,
      userStatus: response.user.userStatus,
      roles: response.user.roles
    };
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    return user?.roles.some(role => role === roleName) ?? false;
  }

  /**
   * Vérifie si l'utilisateur est propriétaire
   */
  isOwner(): boolean {
    return this.hasRole('OWNER');
  }

  /**
   * Vérifie si l'utilisateur est admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}