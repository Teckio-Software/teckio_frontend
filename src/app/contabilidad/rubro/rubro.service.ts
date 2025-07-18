import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { rubroCreacionDTO, rubroDTO } from './tsRubro';
import { cuentaContableDTO } from '../cuenta-contable/tsCuentaContable';

@Injectable({
  providedIn: 'root'
})
export class RubroService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "rubro";
  public obtener(idEmpresa: number): Observable<any>{
    return this.httpClient.get<rubroDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`)
}
  public obtenerTodos(idEmpresa: number): Observable<any>{
    return this.httpClient.get<rubroDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`);
  }

  public obtenerTodosSinPaginar(idEmpresa : number){
    return this.httpClient.get<rubroDTO[]>(`${this.apiUrl}/${idEmpresa}/signapar`);
  }
  public obtenerXId(id: number, idEmpresa : number): Observable<rubroDTO>{
    return this.httpClient.get<rubroDTO>(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
  public crear(registro: rubroCreacionDTO, idEmpresa : number){
    return this.httpClient.post(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public editar(registro: rubroDTO, idEmpresa: number){
    return this.httpClient.put(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public borrar(id: number, idEmpresa : number){
    return this.httpClient.delete(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
}
