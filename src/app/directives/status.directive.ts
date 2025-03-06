import { Directive, ElementRef, input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[status]',
  standalone: true,
})
export class StatusDirective implements OnInit {
  status = input.required<string>();

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.getStatusColor(this.status());
    this.applyStyles();
  }

  private applyStyles() {
    const statusColor = this.getStatusColor(this.status());
    const lighterColor = this.getLighterColor(statusColor);
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      lighterColor
    );
    this.renderer.setStyle(this.el.nativeElement, 'color', statusColor);
  }

  private getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'petrol':
        return 'rgb(50, 31, 172)';
      case 'diesel':
        return 'rgb(247, 144, 9)';
      case 'kerosine':
        return 'rgb(23, 178, 106)';
      case 'approved':
        return 'rgba(2, 122, 72, 1)';

      case 'credit':
        return 'rgba(2, 122, 72, 1)';

      case 'debit':
        return 'rgba(208, 23, 23, 1)';

      case 'declined':
        return 'rgba(208, 23, 23, 1)';

      case 'failed':
        return 'rgba(208, 23, 23, 1)';

      case 'expired':
        return 'rgba(208, 23, 23, 1)';

      case 'pending':
        return 'rgba(21, 57, 250, 1)';

      case 'paid':
        return 'rgba(8, 143, 203, 1)';

      case 'not-paid':
        return 'rgba(135, 3, 3, 1)';

      case 'scheduled':
        return 'rgba(216, 119, 3, 1)';

      case 'delivered':
        return 'rgba(74, 3, 192, 1)';

      case 'confirmed':
        return 'rgba(3, 135, 17, 1)';
      case 'successful':
        return 'rgba(3, 135, 17, 1)';
      case 'active':
        return 'rgba(3, 135, 17, 1)';
      case 'inactive':
        return 'rgba(208, 23, 23, 1)';
      case 'published':
        return 'rgba(3, 135, 17, 1)';

      case 'rejected':
        return 'rgba(208, 23, 23, 1)';

      case 'deactivated':
        return 'rgba(208, 23, 23, 1)';

      case 'review':
        return 'rgba(102, 112, 133, 1)';

      default:
        return 'rgba(8, 143, 203, 1)';
    }
  }

  private getLighterColor(color: string): string {
    const [red, green, blue, alpha] = color
      .substring(color.indexOf('(') + 1, color.lastIndexOf(')'))
      .split(',')
      .map((value) => parseFloat(value.trim()));

    return `rgba(${red}, ${green}, ${blue}, 0.1)`;
  }
}
