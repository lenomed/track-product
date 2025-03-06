import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductDto } from '../../models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpStatusCode } from '@angular/common/http';
import { ProductService } from '../../services/product/product.service';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-track-item',
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './track-item.component.html',
  styleUrl: './track-item.component.css',
})
export class TrackItemComponent {
  trackingCode = signal<string>('');
  isSearching = signal<boolean>(false);

  product = signal<ProductDto | null>(null);
  errorMessage = signal<string>('');
  form = new FormGroup({
    trackingId: new FormControl('', Validators.required),
  });

  private productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  public trackSection = viewChild(ElementRef);

  ngOnInit(): void {
    const trackingCode =
      this.activatedRoute.snapshot.queryParams['trackingCode'];
    if (trackingCode) {
      this.form.patchValue({ trackingId: trackingCode });
      this.trackingCode.set(trackingCode);

      this.searchProduct(true);
    }
  }

  searchProduct(scrollToView: boolean = false): void {
    if (this.form.invalid) {
      this.errorMessage.set('Please enter a tracking code');
      return;
    }

    this.isSearching.set(true);
    this.errorMessage.set('');
    this.product.set(null);

    this.productService
      .trackProduct('', this.form.value.trackingId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.status == HttpStatusCode.Ok && response.success) {
            this.product.set(response.data);
            if (scrollToView) {
              setTimeout(() => {
                this.trackSection()?.nativeElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }, 3000);
            }
          } else {
            this.errorMessage.set(
              response.message || 'No product found with this tracking code'
            );
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
