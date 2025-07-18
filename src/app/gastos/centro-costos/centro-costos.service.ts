import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { centroCostosCreacionDTO, centroCostosDTO } from './tsCentro-Costos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class centroCostosService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "GastosCentroCostos";
  public obtenerPaginado(): Observable<any>{
    return this.httpClient.get<centroCostosDTO[]>(`${this.zvApiUrl}/0/ObtenerCentroCostos`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<centroCostosDTO[]>(`${this.zvApiUrl}/0/sinpaginar`);
  }
  public crear(registro: centroCostosCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/Crear`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<centroCostosDTO>{
    return this.httpClient.get<centroCostosDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
  public editar(registro: centroCostosDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/Editar`, registro);
  }
}
