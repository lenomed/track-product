import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../services/storage/local-storage/local-storage.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStorageService);
  const token = localStorage.getItem<string>('token');
  if (token && req.url.includes('admin')) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }
  return next(req);
};
