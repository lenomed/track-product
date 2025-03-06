import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CreateProductComponent } from './product/create/create.component';
import { UpdateProductComponent } from './product/update/update.component';
import { ProductTableComponent } from './products/products.component';
import { TrackProductComponent } from './product/track/track.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/storage/local-storage/local-storage.service';
import { ContactListComponent } from './contacts/contacts.component';

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
    ContactListComponent,
  ],
})
export class AdminDashboardComponent {
  activeTab = signal<string>('products');
  selectedProductId = signal<string | null>(null);

  router = inject(Router);
  localStorage = inject(LocalStorageService);

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

  logout(): void {
    this.localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
