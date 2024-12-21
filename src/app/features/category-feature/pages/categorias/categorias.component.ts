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

  displayedColumns: string[] = ['nombre', 'accion'];
  dataSource = new MatTableDataSource<Category>();
  value = '';

  ngOnInit(): void {
    this.getAllCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAllCategories() {
    this._categoryService.getAll().pipe(takeUntil(this.destroy$))
    .subscribe((categorias: Category[]) => {
      this.dataSource.data = categorias;
    });
  }
}
