import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../models/api.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContactRequest, ContactResponse } from '../../models/general.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  http = inject(HttpClient);

  contact(model: ContactRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('contacts', model);
  }

  getContacts(): Observable<ApiResponse<ContactResponse[]>> {
    return this.http.get<ApiResponse<ContactResponse[]>>(`admin/contacts`);
  }

  deleteContact(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`admin/contacts/${id}`);
  }
}
