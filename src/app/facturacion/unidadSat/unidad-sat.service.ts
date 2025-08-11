import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UnidadSatDTO } from './ts.unidad-sat';

@Injectable({providedIn: 'root'})
export class UnidadSatService {

    constructor(private HttpClient: HttpClient) { }
    
      private apiUrl = environment.apiURL + "unidadSat";

      public ObtenerTodos(idEmp: number) {
    return this.HttpClient.get<UnidadSatDTO[]>(`${this.apiUrl}/${idEmp}/obtenerTodos`);
  }
    
}