import { Component, signal } from '@angular/core';
import { ProductDto } from '../../../models/product.model';
import { ProductService } from '../../../services/product/product.service';
import { NgClass, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-track-product',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css',
  imports: [NgIf, NgClass, ReactiveFormsModule],
})
export class TrackProductComponent {
  trackingCode = signal<string>('');
  isSearching = signal<boolean>(false);
  product = signal<ProductDto | null>(null);
  errorMessage = signal<string>('');
  form = new FormGroup({
    trackingId: new FormControl('', Validators.required),
  });

  constructor(private productService: ProductService) {}

  searchProduct(): void {
    if (this.form.invalid) {
      this.errorMessage.set('Please enter a tracking code');
      return;
    }

    this.isSearching.set(true);
    this.errorMessage.set('');
    this.product.set(null);

    this.productService.getProduct('', this.form.value.trackingId!).subscribe({
      next: (response) => {
        if (response.status == HttpStatusCode.Ok && response.success) {
          this.product.set(response.data);
        } else {
          this.errorMessage.set('No product found with this tracking code');
        }
        this.isSearching.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error.message ||
            'Error searching for product. Please try again.'
        );
        this.isSearching.set(false);
        console.error('Error searching product:', error);
      },
    });
  }

  clearSearch(): void {
    this.trackingCode.set('');
    this.product.set(null);
    this.errorMessage.set('');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '');
  }
}
