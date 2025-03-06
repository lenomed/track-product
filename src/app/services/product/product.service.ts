import { ApiResponse } from './../../models/api.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { type Observable, of } from 'rxjs';
import { ProductDto } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private adminProductUrl = 'admin/products';
  private trackProductUrl = 'track/products';

  getProducts(): Observable<ApiResponse<ProductDto[]>> {
    return this.http.get<ApiResponse<ProductDto[]>>(this.adminProductUrl);
  }

  getProduct(
    id: string = '',
    trackingCode: string = ''
  ): Observable<ApiResponse<ProductDto>> {
    let params = new HttpParams()
      .set('trackingCode', trackingCode)
      .append('productId', id);
    return this.http.get<ApiResponse<ProductDto>>(
      `${this.adminProductUrl}/search`,
      {
        params,
      }
    );
  }

  trackProduct(
    id: string = '',
    trackingCode: string = ''
  ): Observable<ApiResponse<ProductDto>> {
    let params = new HttpParams()
      .set('trackingCode', trackingCode)
      .append('productId', id);
    return this.http.get<ApiResponse<ProductDto>>(`track/products/search`, {
      params,
    });
  }

  createProduct(product: ProductDto): Observable<ApiResponse<ProductDto>> {
    return this.http.post<ApiResponse<ProductDto>>(
      this.adminProductUrl,
      product
    );
  }

  updateProduct(product: ProductDto): Observable<ApiResponse<ProductDto>> {
    return this.http.put<ApiResponse<ProductDto>>(
      `${this.adminProductUrl}/${product.id}`,
      product
    );
  }

  deleteProduct(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.adminProductUrl}/${id}`);
  }
}
