import { HttpStatusCode } from '@angular/common/http';

export interface ApiResponse<T = null> {
  message: string;
  success: boolean;
  status: HttpStatusCode;
  data: T;
}
