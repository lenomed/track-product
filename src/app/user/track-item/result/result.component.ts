import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDto } from '../../../models/product.model';
import { StatusDirective } from '../../../directives/status.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [StatusDirective, DatePipe],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  trackingId = model<string>('');
  product = signal<ProductDto | null>(null);
  progress = signal<number>(0);

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.trackingId.set(params['trackingId']);
      this.getProductByTrackingId(this.trackingId());
    });
  }

  async getProductByTrackingId(trackingId: string) {
    const mockProduct: ProductDto = {
      id: 'prod123',
      trackingId: 'SWD12345678',
      name: 'Electronics Package',
      description: 'Fragile electronics equipment',
      senderName: 'TechCorp Inc.',
      receiverName: 'John Smith',
      origin: 'San Francisco, CA',
      destination: 'New York, NY',
      departureDate: '2024-03-01',
      arrivalDate: '2024-03-05',
      status: 'In Transit',
    };

    this.product.set(trackingId === 'SWD12345678' ? mockProduct : null);
    if (!this.product()) return;

    this.calculateProgress();
  }

  calculateProgress() {
    if (!this.product) return;

    const departureDate = new Date(this.product()?.departureDate!);
    const arrivalDate = new Date(this.product()?.arrivalDate!);
    const currentDate = new Date();

    if (currentDate >= arrivalDate) {
      this.progress.set(100);
    } else if (currentDate <= departureDate) {
      this.progress.set(0);
    } else {
      const totalTime = arrivalDate.getTime() - departureDate.getTime();
      const elapsedTime = currentDate.getTime() - departureDate.getTime();
      this.progress.set(
        Math.min(100, Math.round((elapsedTime / totalTime) * 100))
      );
    }
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      Pending: 'yellow',
      'In Transit': 'blue',
      Delivered: 'green',
      Delayed: 'orange',
      Cancelled: 'red',
    };
    return statusColors[status] || 'gray';
  }
}
