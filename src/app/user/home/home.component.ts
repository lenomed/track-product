import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiConfig } from '../../config/api.config';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  trackingId = new FormControl('', [
    Validators.required,
    Validators.pattern(/^TRK[0-9]{5}$/),
  ]);

  toast = inject(ToastrService);
  router = inject(Router);

  whatsappNumber = signal<string>(apiConfig.whatsappNumber);

  trackProduct(): void {
    if (this.trackingId.invalid) {
      this.toast.error('Please provide a valid tracking code.');
      return;
    }

    this.router.navigateByUrl(
      `track-item?trackingCode=${this.trackingId.value}`
    );
  }
}
