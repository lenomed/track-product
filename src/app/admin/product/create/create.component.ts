import { Component, signal, output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ProductDto } from '../../../models/product.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  imports: [NgIf, ReactiveFormsModule],
})
export class CreateProductComponent {
  productCreated = output<void>();

  productForm: FormGroup;
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  fb = inject(FormBuilder);

  constructor(private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      senderName: ['', [Validators.required]],
      receiverName: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      departureDate: ['', [Validators.required]],
      arrivalDate: ['', [Validators.required]],
      status: ['Processing', [Validators.required]],
      trackingId: [
        '',
        [Validators.required, Validators.pattern(/^TRK[0-9]{5}$/)],
      ],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const newProduct: ProductDto = {
      ...this.productForm.value,
    };

    this.productService.createProduct(newProduct).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.productForm.reset({
          status: 'Processing',
        });
        this.productCreated.emit();
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error.message || 'Failed to create product. Please try again.'
        );
        console.error('Error creating product:', error);
      },
    });
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  // Generate a random tracking ID
  generateTrackingId(): void {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.productForm.patchValue({
      trackingId: `TRK${randomNum}`,
    });
  }
}
