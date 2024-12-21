import { UserAuth } from './../models/user/user-auth.interface';
import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { catchError, from, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly authState$: Observable<any>;

  constructor(private _auth: Auth ) {
    this.authState$ = authState(this._auth);
  }

  login(email: string, password: string): Observable<UserAuth> {
    return from(signInWithEmailAndPassword(this._auth, email, password)).pipe(
      map((userCredential) => userCredential.user as UserAuth),
      catchError((error) => {
        let errorMessage = 'No se pudo iniciar sesión.';

        if (error.code === 'auth/user-not-found') {
          errorMessage = 'Email o password inválidos.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Email o password inválidos.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): Observable<void> {
    return from(this._auth.signOut()).pipe(
      catchError(() => {
        return throwError(() => new Error('No se pudo cerrar sesión.'));
      })
    );
  }
  
}
