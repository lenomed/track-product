import {
  Component,
  DestroyRef,
  inject,
  type OnInit,
  output,
  signal,
} from '@angular/core';
import type { ProductDto } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [NgClass, FormsModule],
})
export class ProductTableComponent implements OnInit {
  productSelected = output<string>();

  destroyRef = inject(DestroyRef);
  toast = inject(ToastrService);

  products = signal<ProductDto[]>([]);
  isLoading = signal<boolean>(false);
  filteredProducts = signal<ProductDto[]>([]);
  searchTerm = signal<string>('');
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.products.set(response.data);
            this.filteredProducts.set([...response.data]);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);

          this.toast.error(
            error.error.message || 'Error fetching product.',
            error.statusText ?? ''
          );
          console.log(error);
        },
      });
  }

  selectProduct(id: string): void {
    this.productSelected.emit(id);
  }

  deleteProduct(productId: string): void {
    this.isLoading.set(true);
    this.productService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(response.message || 'Product deleted');
            this.loadProducts();
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);

          this.toast.error(
            error.error.message || 'Error fetching product.',
            error.statusText ?? ''
          );
          console.log(error);
        },
      });
  }

  search(): void {
    if (!this.searchTerm().trim()) {
      this.filteredProducts.set([...this.products()]);
      return;
    }

    const term = this.searchTerm().toLowerCase();
    this.filteredProducts.set(
      this.products().filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.trackingId.toLowerCase().includes(term) ||
          product.status.toLowerCase().includes(term)
      )
    );
  }

  sort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    this.filteredProducts().sort((a: any, b: any) => {
      const valueA = a[column]?.toLowerCase();
      const valueB = b[column]?.toLowerCase();

      if (valueA < valueB) {
        return this.sortDirection() === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection() === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() !== column) {
      return '↕';
    }
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
