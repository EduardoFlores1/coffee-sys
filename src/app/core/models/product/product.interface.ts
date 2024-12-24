export interface Product {
  id?: string;
  categoriaId: string;
  nombreCategoria?: string;
  nombre: string;
  precio: number;
  descripcion: string;
  estado: boolean;
}