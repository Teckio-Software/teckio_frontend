import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { SubcategoriaProductoServicio } from './ts.subcategoria-producto-servicio';

@Injectable({providedIn: 'root'})
export class SubcategoriaProductoServicioService {

    constructor(private HttpClient: HttpClient) { }
    
      private apiUrl = environment.apiURL + "subcategoriaProductoServicio";

      public ObtenerTodos(idEmp: number) {
    return this.HttpClient.get<SubcategoriaProductoServicio[]>(`${this.apiUrl}/${idEmp}/obtenerSubcategorias`);
  }

    
}