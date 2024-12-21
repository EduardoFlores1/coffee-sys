import { Injectable } from '@angular/core';
import { CollectionReference, collectionData, doc, collection, Firestore, getDoc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category/category.interface';
import { CategoryCreate } from '../../../core/models/category/category-create.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryCollecion: CollectionReference;

  constructor(private _firestore: Firestore) {
    this.categoryCollecion = collection(this._firestore, 'categorias');
  }

  getAll(): Observable<Category[]> {
    return collectionData(this.categoryCollecion, { idField: 'id' }) as Observable<Category[]>;
  }

  getById(idCategory: string): Observable<Category> {
    const docRef = doc(this.categoryCollecion, idCategory);
    return docData(docRef, { idField: 'id' }) as Observable<Category>;
  }

  create(categoryCreate: CategoryCreate): Observable<void> {
      return new Observable<void>(observer => {
        addDoc(this.categoryCollecion, categoryCreate)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
      });
  }

  updateById(idCategory: string, category: Category): Observable<void> {
    const docRef = doc(this.categoryCollecion, idCategory);
    return new Observable<void>(observer => {
      updateDoc(docRef, { nombre: category.nombre })
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch(error => observer.error(error));
    });
  }

  deleteById(idCategory: string): Observable<void> {
    const docRef = doc(this.categoryCollecion, idCategory);
    return new Observable<void>(observer => {
      deleteDoc(docRef)
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch(error => observer.error(error));
    });
  }
  
}
