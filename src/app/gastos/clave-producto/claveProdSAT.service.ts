import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { claveProdCreacionDTO, ClaveProdSATDTO } from './tsClaveProd';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class claveProdSATService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "ClavesProdSAT";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<ClaveProdSATDTO[]>(`${this.zvApiUrl}/0/ObtenerClavesProd`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<ClaveProdSATDTO[]>(`${this.zvApiUrl}/0/ObtenerClavesProd`);
  }
  public crearRelacion(registro: ClaveProdSATDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearxDivision`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<ClaveProdSATDTO>{
    return this.httpClient.get<ClaveProdSATDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
}
