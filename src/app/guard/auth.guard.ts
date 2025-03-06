import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/storage/local-storage/local-storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorageService);
  const router = inject(Router);
  const token = localStorage.getItem<string>('token');
  return token ? true : router.createUrlTree(['admin/login']);
};
