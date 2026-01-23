import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UpgradeResponse {
  message: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  /**
   * Passe l'utilisateur connecté de USER à OWNER
   * POST /api/users/upgrade-to-owner
   */
  upgradeToOwner(): Observable<UpgradeResponse> {
    return this.http.post<UpgradeResponse>(`${this.API_URL}/upgrade-to-owner`, {});
  }
}