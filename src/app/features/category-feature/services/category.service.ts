import { Injectable } from '@angular/core';
import { CollectionReference, collectionData, doc, collection, Firestore, getDoc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category/category.interface';
import { CategoryCreate } from '../../../core/models/category/category-create.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryCollection: CollectionReference;

  constructor(private _firestore: Firestore) {
    this.categoryCollection = collection(this._firestore, 'categorias');
  }

  getAllStream(): Observable<Category[]> {
    return collectionData(this.categoryCollection, { idField: 'id' }) as Observable<Category[]>;
  }

  getByIdStream(idCategory: string): Observable<Category> {
    const docRef = doc(this.categoryCollection, idCategory);
    return docData(docRef, { idField: 'id' }) as Observable<Category>;
  }

  getById(idCategory: string) {
    const docRef = doc(this.categoryCollection, idCategory);
    return getDoc(docRef);
  }

  create(categoryCreate: CategoryCreate): Observable<void> {
      return new Observable<void>(observer => {
        addDoc(this.categoryCollection, categoryCreate)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
      });
  }

  updateById(idCategory: string, category: Category): Observable<void> {
    const docRef = doc(this.categoryCollection, idCategory);
    return new Observable<void>(observer => {
      updateDoc(docRef, { nombre: category.nombre })
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch(error => observer.error(error));
    });
  }

}
