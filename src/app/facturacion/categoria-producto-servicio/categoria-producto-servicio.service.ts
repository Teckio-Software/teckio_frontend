import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CategoriaProductoServicioDTO } from './ts.categoria-producto-servicio';

@Injectable({ providedIn: 'root' })
export class CategoriaProductoServicioService {
  constructor(private HttpClient: HttpClient) {}

  private apiUrl = environment.apiURL + 'categoriaProductoServicio';

  public ObtenerTodos(idEmp: number) {
    return this.HttpClient.get<CategoriaProductoServicioDTO[]>(
      `${this.apiUrl}/${idEmp}/obtenerCategorias`
    );
  }
}
