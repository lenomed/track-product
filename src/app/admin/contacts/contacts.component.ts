import {
  Component,
  DestroyRef,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { ContactResponse } from '../../models/general.model';
import { GeneralService } from '../../services/general/genera.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  imports: [SlicePipe, FormsModule],
})
export class ContactListComponent implements OnInit {
  contacts = signal<ContactResponse[]>([]);
  filteredContacts = signal<ContactResponse[]>([]);
  searchTerm = signal<string>('');
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  isLoading = signal<boolean>(false);

  destroyRef = inject(DestroyRef);
  toast = inject(ToastrService);
  generalService = inject(GeneralService);

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading.set(true);
    this.generalService
      .getContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.contacts.set(response.data);
            this.filteredContacts.set([...response.data]);
          } else {
            this.toast.error(
              response.message || 'Failed to fetch list of contacts.'
            );
          }
        },
        error: (error) => {
          this.contacts.set([]);
          this.filteredContacts.set([]);
          this.isLoading.set(false);
          this.toast.error(error.error.message || 'Request failed.');
        },
      });
  }

  deleteContact(id: string): void {
    this.isLoading.set(true);
    this.generalService.deleteContact(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success(res.message || 'Contact deleted.');
          this.loadContacts();
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toast.error(error.error.message || 'Failed to delete product.');
        this.isLoading.set(false);
      },
    });
  }

  search(): void {
    if (!this.searchTerm().trim()) {
      this.filteredContacts.set([...this.contacts()]);
      return;
    }

    const term = this.searchTerm().toLowerCase();
    this.filteredContacts.set(
      this.contacts().filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.subject.toLowerCase().includes(term)
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

    this.filteredContacts().sort((a: any, b: any) => {
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
