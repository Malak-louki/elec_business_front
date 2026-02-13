import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.router.navigate(['/home']);
    },
    error: (error) => {
  this.isLoading = false;

  const backendMessage = error?.error?.message;

  if (error.status === 401) {
    this.errorMessage = backendMessage || 'Identifiant ou mot de passe incorrect.';
    return;
  }

  if (error.status === 403) {
    this.errorMessage = backendMessage || 'Compte non activé. Vérifiez votre email.';
    return;
  }

  this.errorMessage = backendMessage || 'Une erreur est survenue. Réessayez.';
  console.error('❌ Erreur de connexion:', error?.error?.message || error?.message || 'Unknown error');
},

    complete: () => {
      this.isLoading = false;
    }
  });
}

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}