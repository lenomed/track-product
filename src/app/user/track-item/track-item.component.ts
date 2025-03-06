import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResultComponent } from './result/result.component';
import { ProductTrackingResultComponent } from '../product/tracking-result.component';
import { ProductDto } from '../../models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/api.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-track-item',
  imports: [ReactiveFormsModule, ProductTrackingResultComponent],
  templateUrl: './track-item.component.html',
  styleUrl: './track-item.component.css',
})
export class TrackItemComponent {
  isLoading = signal<boolean>(false);
  form = new FormGroup({
    trackingId: new FormControl('', Validators.required),
  });

  trackingCode = signal<string>('');
  product = signal<ProductDto | null>(null);
  http = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  toast = inject(ToastrService);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.trackingCode.set(this.form.value.trackingId!);
    this.http
      .get<ApiResponse>(
        `admin/products/search/?trackingCode=${this.trackingCode()}`
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.product.set(response.data);
          } else {
            this.toast.error(response.message);
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);

          this.toast.error(
            error.message ?? 'Error fetching product. Please try again.'
          );
        },
      });

    // this.calculateProgress();
  }
  // this.router.navigate(['/tracking', this.form.value.trackingId]);
}
