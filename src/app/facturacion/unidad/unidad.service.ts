import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UnidadDTO } from './ts.unidad';

@Injectable({ providedIn: 'root' })
export class UnidadService {
  constructor(private HttpClient: HttpClient) {}

  private apiUrl = environment.apiURL + 'unidad';

  public ObtenerTodos(idEmp: number) {
    return this.HttpClient.get<UnidadDTO[]>(`${this.apiUrl}/${idEmp}/obtenerTodos`);
  }
}
