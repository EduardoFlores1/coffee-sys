import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProgressbarService } from '../../services/progressbar.service';

@Component({
  selector: 'app-manage-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  templateUrl: './manage-layout.component.html',
  styleUrl: './manage-layout.component.css'
})
export class ManageLayoutComponent {

  private authSubscription?: Subscription;

  _authService = inject(AuthService);
  _progressbarService = inject(ProgressbarService);

  constructor(private _router: Router) {
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  cerrarSesion() {
    this.authSubscription = this._authService.logout()
      .subscribe({
        next: () => 
          this._router.navigateByUrl('/')
      });
  }
}
