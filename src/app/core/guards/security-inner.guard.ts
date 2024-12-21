import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const securityInnerGuard: CanActivateFn = (route, state) => {

  const authState$ = inject(AuthService).authState$;
  const router = inject(Router);

  return authState$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};
