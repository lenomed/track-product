import { Component, signal } from '@angular/core';
import { apiConfig } from '../../../config/api.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [RouterLink],
})
export class FooterComponent {
  phoneNumber = signal<string>(apiConfig.whatsappNumber);
  email = signal<string>(apiConfig.email);
}
