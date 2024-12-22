import { Category } from './../../../../core/models/category/category.interface';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CategoryService } from '../../services/category.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalCategoryComponent } from '../../components/modal-category/modal-category.component';
import { CategoryCreate } from '../../../../core/models/category/category-create.interface';
import { ModalResponse } from '../../../../core/models/modal/modal-response.interface';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export default class CategoriasComponent {

  private destroy$ = new Subject<void>();

  private _categoryService = inject(CategoryService);
  private _snackbarService = inject(SnackbarService);

  displayedColumns: string[] = ['nombre', 'accion'];
  dataSource = new MatTableDataSource<Category>();

  constructor(private dialog: MatDialog) { } 

  ngOnInit(): void {
    this.getAllCategories();
    this.filterByNombre();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAllCategories() {
    this._categoryService.getAll().pipe(takeUntil(this.destroy$))
    .subscribe((categorias: Category[]) => {
      console.log(categorias);
      this.dataSource.data = categorias;
    });
  }

  private createCategory(categoryCreate: CategoryCreate) {
    this._categoryService.create(categoryCreate)
    .subscribe({
      next: () => {
        this._snackbarService.open('Categoría creada correctamente', 'ok');
      },
      error: () => {
        this._snackbarService.open('No se creó la categoría', 'error');
      }
    });
  }

  private updateCategory(idCategory: string, category: Category) {
    this._categoryService.updateById(idCategory, category)
    .subscribe({
      next: () => {
        this._snackbarService.open('Categoría actualizada correctamente', 'ok');
      },
      error: () => {
        this._snackbarService.open('No se actualizó la categoría', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private filterByNombre() {
    this.dataSource.filterPredicate = (data: Category, filter: string) => {
      return data.nombre.toLowerCase().includes(filter);
    };
  }

  openDialog(category?: Category) {
    const dialogRef = this.dialog.open(ModalCategoryComponent, {
      width: '400px',
      height: '220px',
      data: {
        title: !category ? 'Crear categoría' : 'Actualizar categoría', 
        action: !category ? 'crear' : 'actualizar',
        dataResult: category
      }
    });

    dialogRef.afterClosed().subscribe((result: ModalResponse) => {

      if(!result) {
        return;
      }

      if(result.action === 'crear') {
        this.createCategory({nombre: result.dataResult});
      }
      if(result.action === 'actualizar') {
        this.updateCategory(category?.id!, {nombre: result.dataResult});
      }

    });
  }

}
