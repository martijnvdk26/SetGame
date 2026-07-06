import { HttpInterceptorFn } from '@angular/common/http';

// Attaches the JWT to every outgoing request so services don't build headers by hand.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
