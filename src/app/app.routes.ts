import { Routes } from '@angular/router';
import { ManageLayoutComponent } from './core/layout/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { securityInnerGuard } from './core/guards/security-inner.guard';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "login",
    title: "Login",
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/pages/login/login.component')
  },
  {
    path: "home",
    title: "Home",
    loadComponent: () => import('./features/vista-publica/pages/home/home.component')
  },
  {
    path: "manage",
    component: ManageLayoutComponent,
    canActivate: [securityInnerGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        title: "Dashboard",
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component')
      },
      {
        path: "categorias",
        title: "Categorías",
        loadComponent: () => import('./features/category-feature/pages/categorias/categorias.component')
      },
      {
        path: "productos",
        title: "Productos",
        loadComponent: () => import('./features/product-feature/pages/productos/productos.component')
      },
      {
        path: "ordenes",
        title: "Ordenes",
        loadComponent: () => import('./features/order-feature/pages/ordenes/ordenes.component') 
      },
      {
        path: "ventas",
        title: "Ventas",
        loadComponent: () => import('./features/bill-feature/pages/ventas/ventas.component') 
      },
      {
        path: "usuarios",
        title: "Usuarios",
        loadComponent: () => import('./features/user-feature/pages/usuarios/usuarios.component') 
      }
    ]
  }
];
