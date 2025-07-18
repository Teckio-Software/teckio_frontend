import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { plazaCreacionDTO, plazaDTO } from './tsPlazas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class plazaService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "Plazas";
  public obtenerPaginado(): Observable<any>{
    return this.httpClient.get<plazaDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazas`);
  }
  public obtenerXIdDivision(id: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<plazaDTO[]>(`${this.zvApiUrl}/0/ObtenerxidDivision/${id}`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<plazaDTO[]>(`${this.zvApiUrl}/0/sinpaginar`);
  }
  public crear(registro: plazaDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/Crear`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<plazaDTO>{
    return this.httpClient.get<plazaDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
  public editar(registro: plazaDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/Editar`, registro);
  }
}
