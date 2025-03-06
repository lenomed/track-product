import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
  styles: [``],
})
export class LayoutComponent {}
