import { HttpInterceptorFn } from '@angular/common/http';
import { apiConfig } from '../config/api.config';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('http')) {
    return next(req);
  }
  const apiReq = req.clone({ url: `${apiConfig.baseUrl}/${req.url}` });
  return next(apiReq);
};
