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
import { ProductCreate } from '../../../../core/models/product/product-create.interface';


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
    this.setFieldsProduct(this.dataModal);

  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  get f() {
    return this.productForm.controls;
  }

  setFieldsProduct(dataModal: ModalRequest) {
    if(this.dataModal.action === 'actualizar') {
      this.f['nombre'].setValue(dataModal.dataResult.nombre);
      this.f['categoriaId'].setValue(dataModal.dataResult.categoriaId);
      this.f['precio'].setValue(dataModal.dataResult.precio);
      this.f['descripcion'].setValue(dataModal.dataResult.descripcion);
    }
  }

  getAllCategories() {
    this.categories$ = this._categoryService.getAllStream();
  }

  createForm() {
    this.productForm = this._fb.group({
      categoriaId: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      precio: [0, [Validators.required, Validators.min(1), Validators.max(10000)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {

      const productCreate: ProductCreate = {
        categoriaId: this.f['categoriaId'].value,
        nombre: this.f['nombre'].value,
        precio: this.f['precio'].value,
        descripcion: this.f['descripcion'].value
      }

      const modalResponse: ModalResponse = {
        action: this.dataModal.action,
        dataResult: productCreate
      }

      this._dialogRef.close(modalResponse);
    }
  }

  closeModal() {
    this._dialogRef.close();
  }

}
