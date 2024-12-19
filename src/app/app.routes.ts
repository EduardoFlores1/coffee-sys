import { Routes } from '@angular/router';
import { ManageLayoutComponent } from './core/layout/manage-layout/manage-layout.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "login",
    title: "Login",
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
    children: [
      {
        path: "dashboard",
        title: "Dashboard",
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component')
      },
      {
        path: "categorias",
        title: "Categorias",
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
      }
    ]
  }
];