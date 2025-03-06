import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageService } from '../../services/storage/local-storage/local-storage.service';
import { ApiResponse } from '../../models/api.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class AdminLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private localStorageService = inject(LocalStorageService);

  public isLoading = signal<boolean>(false);

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.http
      .get<ApiResponse<{ token: string }>>('login', {
        params: {
          email: this.form.value.email!,
          password: this.form.value.password!,
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.localStorageService.setItem('token', response.data.token);
            this.toast.success('Login successful', 'Authenticated');
            this.router.navigate(['/admin']);
          } else {
            this.toast.error(response.message || 'Invalid credentials');
          }
        },
        error: (error) => {
          this.toast.error(
            error?.error?.message ?? 'Login failed',
            error.statusText
          );
          this.isLoading.set(false);
        },
      });
  }
}
