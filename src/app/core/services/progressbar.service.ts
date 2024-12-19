import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressbarService {

  constructor() { }

  showProgress = signal<boolean>(false);

  open() {
    this.showProgress.set(true);
  }

  close() {
    this.showProgress.set(false);
  }
}
