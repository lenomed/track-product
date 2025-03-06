import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import { type Observable, of } from 'rxjs';
import { ProductDto } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'api/products'; // Replace with your actual API URL

  // Mock data for demonstration
  private mockProducts: ProductDto[] = [
    {
      id: '1',
      name: 'Electronics Package',
      description: 'Laptop and accessories',
      senderName: 'Tech Solutions Inc.',
      receiverName: 'John Smith',
      origin: 'San Francisco, CA',
      destination: 'New York, NY',
      departureDate: '2023-06-15',
      arrivalDate: '2023-06-18',
      status: 'Delivered',
      trackingId: 'TRK12345',
    },
    {
      id: '2',
      name: 'Office Supplies',
      description: 'Paper, pens, and staplers',
      senderName: 'Office Depot',
      receiverName: 'Acme Corp',
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      departureDate: '2023-06-20',
      arrivalDate: '2023-06-22',
      status: 'In Transit',
      trackingId: 'TRK67890',
    },
    {
      id: '3',
      name: 'Furniture Shipment',
      description: 'Desk and chair set',
      senderName: 'Modern Furnishings',
      receiverName: 'Sarah Johnson',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      departureDate: '2023-06-25',
      arrivalDate: '2023-06-26',
      status: 'Processing',
      trackingId: 'TRK24680',
    },
  ];

  getProducts(): Observable<ProductDto[]> {
    // For demo purposes, return mock data
    // In a real app, use: return this.http.get<ProductDto[]>(this.apiUrl);
    return of(this.mockProducts);
  }

  getProduct(id: string): Observable<ProductDto> {
    // For demo purposes
    const product = this.mockProducts.find((p) => p.id === id);
    return of(product as ProductDto);
  }

  createProduct(product: ProductDto): Observable<ProductDto> {
    // For demo purposes
    // In a real app, use: return this.http.post<ProductDto>(this.apiUrl, product);
    return of({ ...product, id: Date.now().toString() });
  }

  updateProduct(product: ProductDto): Observable<ProductDto> {
    // For demo purposes
    // In a real app, use: return this.http.put<ProductDto>(`${this.apiUrl}/${product.id}`, product);
    return of(product);
  }

  deleteProduct(id: string): Observable<void> {
    // For demo purposes
    // In a real app, use: return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(undefined);
  }
}
