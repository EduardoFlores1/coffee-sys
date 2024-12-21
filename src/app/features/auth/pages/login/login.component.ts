import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { ProgressbarService } from '../../../../core/services/progressbar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  private authSubscription?: Subscription;

  _snackbarService = inject(SnackbarService);
  _progressbarService = inject(ProgressbarService);
  _authService = inject(AuthService);

  loginForm!: FormGroup;
  hidePassword: boolean = true;
  sigErrorEmail = signal<string>('');
  sigErrorPassword = signal<string>('');

  intervalId: any;

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private createForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  updateErrorMessageEmail() {
    if(this.f['email'].hasError('required')) {
      this.sigErrorEmail.set('El email es requerido');
    }else if(this.f['email'].hasError('email')) {
      this.sigErrorEmail.set('Email no válido');
    }else {
      this.sigErrorEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if(this.f['password'].hasError('required')) {
      this.sigErrorPassword.set('El password es requerido');
    }else if(this.f['password'].hasError('minlength')) {
      this.sigErrorPassword.set('Mín 8 caracteres');
    }else if(this.f['password'].hasError('maxlength')) {
      this.sigErrorPassword.set('Max 16 caracteres');
    }else {
      this.sigErrorPassword.set('');
    }
  }

  tryLogin() {
    if(this.loginForm.valid) {

      this._progressbarService.open();

      this.authSubscription = this._authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => this._router.navigateByUrl('/manage'),
        error: (error) => {
          this._snackbarService.open(error, 'error');
          this._progressbarService.close();
        },
        complete: () => this._progressbarService.close()
      });

    }
    
  }

}
