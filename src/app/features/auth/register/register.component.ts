import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private readonly PHONE_FR_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/;

  constructor() {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern(this.PHONE_FR_REGEX)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private normalizePhone(input: unknown): string | undefined {
    const raw = String(input ?? '').trim();
    if (!raw) return undefined;

    // On garde uniquement + et chiffres (tolère si user a mis espaces/tirets)
    const cleaned = raw.replace(/[^\d+]/g, '');

    // Déjà E.164 FR : +33XXXXXXXXX
    if (cleaned.startsWith('+33')) return cleaned;

    // Format FR : 0XXXXXXXXX -> +33XXXXXXXXX (on enlève le 0)
    if (/^0[1-9]\d{8}$/.test(cleaned)) {
      return `+33${cleaned.substring(1)}`;
    }

    // Si ça ne matche pas ces formats, on renvoie la version cleaned
    // (la validation du formulaire devrait déjà bloquer, mais on reste défensif)
    return cleaned;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const raw = this.registerForm.getRawValue();

    const phone = this.normalizePhone(raw.phone);

    const registerData = {
      email: raw.email,
      username: raw.username,
      lastName: raw.lastName,
      password: raw.password,
      ...(phone ? { phone } : {})
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Inscription réussie ! Vérifiez votre email pour activer votre compte.';
        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;

        // Plus fiable que error.message seul (Angular HttpErrorResponse)
        this.errorMessage =
          error?.error?.message ||
          error?.error?.error ||
          error?.message ||
          "Erreur lors de l'inscription";

        console.error("Erreur d'inscription:", error?.error?.message || error?.message || 'Unknown error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get username() {
    return this.registerForm.get('username');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
