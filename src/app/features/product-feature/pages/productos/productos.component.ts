import { Product } from './../../../../core/models/product/product.interface';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductComponent } from '../../components/modal-product/modal-product.component';
import { ModalResponse } from '../../../../core/models/modal/modal-response.interface';
import { ProductCreate } from '../../../../core/models/product/product-create.interface';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatSlideToggleModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export default class ProductosComponent {

  private destroy$ = new Subject<void>();

  private _productService = inject(ProductService);
  private _snackbarService = inject(SnackbarService);

  displayedColumns: string[] = ['nombreCategoria', 'nombre', 'precio', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Product>();
  value = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.filterByNombre();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAllProducts() {
      this._productService.getAllStream().pipe(takeUntil(this.destroy$))
      .subscribe((productos: Product[]) => {
        this.dataSource.data = productos;
      });
  }

  private createProduct(productCreate: ProductCreate) {
      this._productService.create(productCreate)
      .subscribe({
        next: () => {
          this._snackbarService.open('Producto creado correctamente', 'ok');
        },
        error: () => {
          this._snackbarService.open('No se creó el producto', 'error');
        }
      });
  }
  
  private updateProduct(idProduct: string, product: Product) {
    this._productService.updateById(idProduct, product)
    .subscribe({
      next: () => {
        this._snackbarService.open('Producto actualizado correctamente', 'ok');
      },
      error: () => {
        this._snackbarService.open('No se actualizó el producto', 'error');
      }
    });
  }

  private enabledProduct(product: Product) {
    this._productService.enabledById(product.id!)
    .subscribe({
      next: () => {
        this._snackbarService.open(`Producto ${product.nombre} habilitado`, 'ok');
      },
      error: () => {
        this._snackbarService.open(`No se habilitó ${product.nombre}`, 'error');
      }
    });
  }

  private disabledProduct(product: Product) {
    this._productService.disabledById(product.id!)
    .subscribe({
      next: () => {
        this._snackbarService.open(`Producto ${product.nombre} desabilitado`, 'ok');
      },
      error: () => {
        this._snackbarService.open(`No se desabilitó ${product.nombre}`, 'error');
      }
    });
  }

  private deleteProduct(idProduct: string) {
    this._productService.deleteById(idProduct)
    .subscribe({
      next: () => {
        this._snackbarService.open('Producto eliminado exitosamente', 'ok');
      },
      error: () => {
        this._snackbarService.open('No se pudo eliminar el producto', 'error');
      }
    });
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  private filterByNombre() {
    this.dataSource.filterPredicate = (data: Product, filter: string) => {
      return data.nombre.toLowerCase().includes(filter);
    };
  }

  onToggleState(product: Product) {
    if (product.estado) {
      this.disabledProduct(product);
    }else {
      this.enabledProduct(product);
    }
  }

  openDialog(product?: Product) {
      const dialogRef = this.dialog.open(ModalProductComponent, {
        width: '550px',
        disableClose: true,
        data: {
          title: !product ? 'Crear producto' : 'Actualizar producto', 
          action: !product ? 'crear' : 'actualizar',
          dataResult: product
        }
      });
  
      dialogRef.afterClosed().subscribe((result: ModalResponse) => {
  
        if(!result) {
          return;
        }
  
        if(result.action === 'crear') {
          this.createProduct(result.dataResult);
        }
        if(result.action === 'actualizar') {
          this.updateProduct(product?.id!, result.dataResult);
        }
  
      });
    }

    openDeleteModal(product: Product) {
      const modalConfirmRef = this.dialog.open(ModalConfirmComponent, {
        width: "500px",
        data: {
          title: `¿Desea eliminar el producto ${product.nombre}?`,
          icon: 'warning'
        }
      });

      modalConfirmRef.afterClosed().subscribe((result: boolean) => {
        if (result) this.deleteProduct(product.id!);
      });
    }

}
