import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (error.error && typeof error.error === 'object' && error.error.message) ||
        'Ocurrió un error inesperado. Intente nuevamente.';

      snackBar.open(message, 'Cerrar', { duration: 5000 });

      return throwError(() => error);
    }),
  );
};
