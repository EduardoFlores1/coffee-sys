import { Product } from './../../../core/models/product/product.interface';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';
import { CategoryService } from '../../category-feature/services/category.service';
import { Category } from '../../../core/models/category/category.interface';
import { ProductCreate } from '../../../core/models/product/product-create.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection: CollectionReference;

  constructor(private _firestore: Firestore, private _categoryService: CategoryService) {
    this.productCollection = collection(this._firestore, 'productos');
  }

  getAllStream(): Observable<Product[]> {
      return (collectionData(this.productCollection, { idField: 'id' }) as Observable<Product[]>).pipe(
        switchMap((products: Product[]) => {
          const productsWithCategory$ = products.map(product => 
            this.getNombreCategoryProduct(product.categoriaId).pipe(
              map(catName => {
                product.nombreCategoria = catName;
                return product;
              })
            )
          ) 
          
          return combineLatest(productsWithCategory$);},
        ));
  }

  private getNombreCategoryProduct(idCategory: string): Observable<string> {
    return from(this._categoryService.getById(idCategory))
    .pipe(
      map(catSnap => {
        if(catSnap.exists()) {
          return (catSnap.data() as Category).nombre;
        }
        return 'NA';
      })
    )
  }

  getByIdStream(idProduct: string): Observable<Product> {
      const docRef = doc(this.productCollection, idProduct);
      return docData(docRef, { idField: 'id' }) as Observable<Product>;
  }


  create(productCreate: ProductCreate): Observable<void> {
        return new Observable<void>(observer => {
          addDoc(this.productCollection, {...productCreate, estado: true})
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch(error => observer.error(error));
        });
  }

  updateById(idProduct: string, product: Product): Observable<void> {
      const docRef = doc(this.productCollection, idProduct);
      return new Observable<void>(observer => {
        updateDoc(docRef, {
          categoriaId: product.categoriaId,
          nombre: product.nombre,
          precio: product.precio,
          descripcion: product.descripcion
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
      });
  }

}
