import { Component, input } from '@angular/core';
import { ProductDto } from '../../models/product.model';
import { StatusDirective } from '../../directives/status.directive';

@Component({
  selector: 'app-product-tracking-result',
  standalone: true,
  imports: [StatusDirective],
  templateUrl: './tracking-result.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProductTrackingResultComponent {
  trackingNumber = input.required<string>();
  product = input.required<ProductDto>();

  downloadTrackingDetails() {
    window.print();
  }
}
