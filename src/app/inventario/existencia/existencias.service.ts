import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { existenciaActualizacionDTO, existenciasInsumosDTO } from './tsExistencia';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasService {

  constructor(private HttpClient: HttpClient){}
  private apiUrl = environment.apiURL + "existencias";

  public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number): Observable<any>{
      let params = new HttpParams();
      params = params.append('pagina', pagina.toString());
      params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
      return this.HttpClient.get<existenciasInsumosDTO[]>(`${this.apiUrl}/todos`, {observe: 'response', params});
  }
  public todosSinPaginar() {
    return this.HttpClient.get<existenciasInsumosDTO[]>(`${this.apiUrl}/sinpaginar`);
  }

  public obtenInsumosExistentes (idEmp: number, idAlmacen : number){
    return this.HttpClient.get<existenciasInsumosDTO[]>(`${this.apiUrl}/${idEmp}/obtenInsumosExistentes/${idAlmacen}`);
  }

  public existenciaYAlmacenDeInsumo (idEmp: number, idInsumo : number, idProyecto : number){
    return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmp}/existenciaYAlmacenDeInsumo/${idInsumo}/${idProyecto}`);
  }

  public obtenDetallesInsumosExistentes (idEmp: number, idAlmacen : number, idInsumo : number){
    return this.HttpClient.get<existenciasInsumosDTO[]>(`${this.apiUrl}/${idEmp}/obtenDetallesInsumosExistentes/${idAlmacen}/${idInsumo}`);
  }

  public todosSinPaginarXIdAlmacen(idAlmacen: number) {
    return this.HttpClient.get<existenciasInsumosDTO[]>(`${this.apiUrl}/sinpaginar/${idAlmacen}`);
  }

  public crear(registro: existenciaActualizacionDTO){
    return this.HttpClient.post(this.apiUrl, registro);
  }
}
