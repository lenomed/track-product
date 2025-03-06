import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CreateProductComponent } from './product/create/create.component';
import { UpdateProductComponent } from './product/update/update.component';
import { ProductTableComponent } from './products/products.component';
import { TrackProductComponent } from './product/track/track.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NgIf,
    CreateProductComponent,
    UpdateProductComponent,
    ProductTableComponent,
    TrackProductComponent,
  ],
})
export class AdminDashboardComponent {
  activeTab = signal<string>('products');
  selectedProductId = signal<string | null>(null);

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
    if (tab !== 'update') {
      this.selectedProductId.set(null);
    }
  }

  handleProductSelect(productId: string): void {
    this.selectedProductId.set(productId);
    this.setActiveTab('update');
  }

  handleProductCreated(): void {
    this.setActiveTab('products');
  }

  handleProductUpdated(): void {
    this.setActiveTab('products');
  }
}
