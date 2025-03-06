import { Component, type OnInit, output, signal } from '@angular/core';
import type { ProductDto } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [NgClass, FormsModule],
})
export class ProductTableComponent implements OnInit {
  productSelected = output<string>();

  products = signal<ProductDto[]>([]);
  filteredProducts = signal<ProductDto[]>([]);
  searchTerm = signal<string>('');
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products.set(products);
      this.filteredProducts.set([...products]);
    });
  }

  selectProduct(id: string): void {
    this.productSelected.emit(id);
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
