import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { claveProdCreacionDTO, claveProdDTO } from './tsClaveProd';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class claveProdService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "ClavesProdSATDivision";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<claveProdDTO[]>(`${this.zvApiUrl}/0/ObtenerClavesProdDivision`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<claveProdDTO[]>(`${this.zvApiUrl}/0/ObtenerClavesProdDivision`);
  }
  public crearRelacion(registro: claveProdDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearxDivision`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<claveProdDTO>{
    return this.httpClient.get<claveProdDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
}
