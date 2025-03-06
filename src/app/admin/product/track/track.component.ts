import { Component, signal } from '@angular/core';
import { ProductDto } from '../../../models/product.model';
import { ProductService } from '../../../services/product/product.service';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-track-product',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css',
  imports: [NgIf, NgClass, FormsModule],
})
export class TrackProductComponent {
  trackingCode = signal<string>('');
  isSearching = signal<boolean>(false);
  product = signal<ProductDto | null>(null);
  errorMessage = signal<string>('');

  constructor(private productService: ProductService) {}

  searchProduct(): void {
    if (!this.trackingCode().trim()) {
      this.errorMessage.set('Please enter a tracking code');
      return;
    }

    this.isSearching.set(true);
    this.errorMessage.set('');
    this.product.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        const foundProduct = products.find(
          (p) =>
            p.trackingId.toLowerCase() === this.trackingCode().toLowerCase()
        );

        if (foundProduct) {
          this.product.set(foundProduct);
        } else {
          this.errorMessage.set('No product found with this tracking code');
        }
        this.isSearching.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error searching for product. Please try again.');
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
