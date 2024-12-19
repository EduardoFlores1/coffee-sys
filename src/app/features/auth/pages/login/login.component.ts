import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { ProgressbarService } from '../../../../core/services/progressbar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  _snackbarService = inject(SnackbarService);
  _progressbarService = inject(ProgressbarService);

  loginForm!: FormGroup;
  hidePassword: boolean = true;
  sigErrorEmail = signal<string>('');
  sigErrorPassword = signal<string>('');

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.createForm();
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
      this._snackbarService.open('Login ejecutado', 'OK');
    }
  }

}
