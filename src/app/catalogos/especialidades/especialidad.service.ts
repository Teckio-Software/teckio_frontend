import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { especialidadCreacionDTO, especialidadDTO } from './tsEspecialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "especialidad";
  public obtener(idEmpresa: number): Observable<any>{
    return this.httpClient.get<especialidadDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<especialidadDTO[]>(`${this.apiUrl}/${idEmpresa}/sinpaginar`);
  }
  public crear(registro: especialidadCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<especialidadDTO>{
    return this.httpClient.get<especialidadDTO>(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
  public editar(registro: especialidadDTO, idEmpresa: number){
    return this.httpClient.put(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public borrar(id: number, idEmpresa: number){
    return this.httpClient.delete(`${this.apiUrl}/${idEmpresa}/${id}`);
  }

  public filtrar(valores: any, idEmpresa: number){
    const params = new HttpParams({fromObject: valores});
    return this.httpClient.get<especialidadDTO[]>(`${this.apiUrl}/${idEmpresa}/buscar`, {params, observe: 'response'});
  }
}
