import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackbar: MatSnackBar) { }

  open(message: string, action: string, duration: number = 5000) {
    this._snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
