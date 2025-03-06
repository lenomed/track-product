import {
  Component,
  type OnInit,
  Input,
  Output,
  EventEmitter,
  signal,
  output,
  input,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductDto } from '../../../models/product.model';
import { ProductService } from '../../../services/product/product.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-update-product',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  imports: [NgIf, ReactiveFormsModule],
})
export class UpdateProductComponent implements OnInit {
  productId = input<string | null>(null);
  productUpdated = output<void>();

  productForm: FormGroup;
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  private fb = inject(FormBuilder);

  constructor(private productService: ProductService) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      senderName: ['', [Validators.required]],
      receiverName: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      departureDate: ['', [Validators.required]],
      arrivalDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      trackingId: [
        '',
        [Validators.required, Validators.pattern(/^TRK[0-9]{5}$/)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    if (!this.productId()) {
      this.errorMessage.set('No product selected');
      this.isLoading.set(false);
      return;
    }

    this.productService.getProduct(this.productId()!).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.productForm.patchValue(response.data);
        }
      },
      error: (error) => {
        this.errorMessage.set(
          error.error.message || 'Failed to load product details'
        );
        this.isLoading.set(false);
        console.error('Error loading product:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const updatedProduct: ProductDto = this.productForm.value;

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Product updated successfully');
        setTimeout(() => {
          this.productUpdated.emit();
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error.message || 'Failed to update product. Please try again.'
        );
        console.error('Error updating product:', error);
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
}
