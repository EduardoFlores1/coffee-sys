import { Component, Inject, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalRequest } from '../../../../core/models/modal/modal-request.interface';
import { MatButtonModule } from '@angular/material/button';
import { ModalResponse } from '../../../../core/models/modal/modal-response.interface';

@Component({
  selector: 'app-modal-category',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './modal-category.component.html',
  styleUrl: './modal-category.component.css'
})
export class ModalCategoryComponent {

  categoryForm!: FormGroup;
  sigErrorNombre = signal<string>('');

  constructor(
    private _fb: FormBuilder, 
    private _dialogRef: MatDialogRef<ModalCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any
  ) {

    this.createForm();
    this.setFieldNombre(this.dataModal);

  }

  get f() {
    return this.categoryForm.controls;
  }

  updateErrorMessageNombre() {
    if (this.f['nombre'].hasError('required')) {
      this.sigErrorNombre.set('El nombre es requerido');
    } else if (this.f['nombre'].hasError('minlength')) {
      this.sigErrorNombre.set('Mínimo 3 caracteres');
    } else if (this.f['nombre'].hasError('maxlength')) {
      this.sigErrorNombre.set('Máximo 20 caracteres');
    }
  }

  setFieldNombre(dataModal: ModalRequest) {
    if(this.dataModal.action === 'actualizar') {
      this.f['nombre'].setValue(dataModal.dataResult.nombre);
    }
  }

  createForm() {
    this.categoryForm = this._fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const modalResponse: ModalResponse = {
        action: this.dataModal.action,
        dataResult: this.f['nombre'].value
      }

      this._dialogRef.close(modalResponse);
    }
  }

  closeModal() {
    this._dialogRef.close();
  }
}
