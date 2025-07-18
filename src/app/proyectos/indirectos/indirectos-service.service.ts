import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ConjuntoIndirectosDTO } from '../conjunto-indirectos/conjunto-indirectos';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { IndirectosDTO } from './indirectos';

@Injectable({
  providedIn: 'root'
})
export class IndirectosServiceService {

  constructor(private http: HttpClient){}
  private apiUrl = environment.apiURL + "indirectos/";

  public ObtenerConjuntoIndirecto(idEmp : number, idProyecto : number){
    return this.http.get<ConjuntoIndirectosDTO>(`${this.apiUrl}${idEmp}/ObtenerConjuntoIndirecto/${idProyecto}`);
  }

  public CrearConjuntoIndirecto(idEmp : number, idProyecto : number){
    return this.http.get<RespuestaDTO>(`${this.apiUrl}${idEmp}/CrearConjuntoIndirecto/${idProyecto}`);
  }

  public EditarConjuntoIndirecto(idEmp : number, conjunto : ConjuntoIndirectosDTO){
    return this.http.put<RespuestaDTO>(`${this.apiUrl}${idEmp}/EditarConjuntoIndirecto`, conjunto);
  }

  public ObtenerIndirectos(idEmp : number, idProyecto : number){
    return this.http.get<IndirectosDTO[]>(`${this.apiUrl}${idEmp}/ObtenerIndirectos/${idProyecto}`);
  }

  public CrearIndirecto(idEmp : number, registro : IndirectosDTO){
    return this.http.post<RespuestaDTO>(`${this.apiUrl}${idEmp}/CrearIndirecto`, registro);
  }

  public EditarIndirecto(idEmp : number, registro : IndirectosDTO){
    return this.http.put<RespuestaDTO>(`${this.apiUrl}${idEmp}/EditarIndirecto`, registro);
  }

  public EliminarIndirecto(idEmp : number, idIndirecto : number){
    return this.http.delete<RespuestaDTO>(`${this.apiUrl}${idEmp}/EliminarIndirecto/${idIndirecto}`);
  }
}
