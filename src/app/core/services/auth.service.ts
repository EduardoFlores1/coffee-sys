import { UserAuth } from './../models/user/user-auth.interface';
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { catchError, from, map, Observable, ReplaySubject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth: Auth;
  private userSubject: ReplaySubject<UserAuth | null>;
  readonly authState$: Observable<any>;

  constructor() {
    const app = initializeApp(environment.angularfire_credential);
    this._auth = getAuth(app);

    this.userSubject = new ReplaySubject<UserAuth | null>(1);
    this.authState$ = this.userSubject.asObservable();

    this.setCurrentUser();
  }

  private setCurrentUser() {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        this.userSubject.next(user as UserAuth);
      }else {
        this.userSubject.next(null);
      }
    });
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
