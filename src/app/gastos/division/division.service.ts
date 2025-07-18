import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { divisionCreacionDTO, divisionDTO } from './tsDivision';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class divisionService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "Divisiones";
  public obtenerPaginado(): Observable<any>{
    return this.httpClient.get<divisionDTO[]>(`${this.zvApiUrl}/0/ObtenerDivisiones`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<divisionDTO[]>(`${this.zvApiUrl}/0/ObtenerDivisiones`);
  }
  public crear(registro: divisionCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/Crear`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<divisionDTO>{
    return this.httpClient.get<divisionDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
  public editar(registro: divisionDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/Editar`, registro);
  }
}
