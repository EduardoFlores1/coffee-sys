import { Component, inject, Inject, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalRequest } from '../../../../core/models/modal/modal-request.interface';
import { MatButtonModule } from '@angular/material/button';
import { ModalResponse } from '../../../../core/models/modal/modal-response.interface';
import {MatSelectModule} from '@angular/material/select';
import { CategoryService } from '../../../category-feature/services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../../../core/models/category/category.interface';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-modal-product',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    AsyncPipe
  ],
  templateUrl: './modal-product.component.html',
  styleUrl: './modal-product.component.css'
})
export class ModalProductComponent {

  private _categoryService = inject(CategoryService);
  categories$!: Observable<Category[]>;

  productForm!: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _dialogRef: MatDialogRef<ModalProductComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any
  ) {

    this.createForm();
    this.setFieldNombre(this.dataModal);

  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  get f() {
    return this.productForm.controls;
  }

  setFieldNombre(dataModal: ModalRequest) {
    if(this.dataModal.action === 'actualizar') {
      this.f['nombre'].setValue(dataModal.dataResult.nombre);
    }
  }

  getAllCategories() {
    this.categories$ = this._categoryService.getAllStream();
  }

  createForm() {
    this.productForm = this._fb.group({
      categoriaId: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      precio: [null, [Validators.required, Validators.min(1), Validators.max(10000)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
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
