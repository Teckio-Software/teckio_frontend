import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { contratistaDTO } from './tsContratista';
import { Observable } from 'rxjs';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';

@Injectable({
  providedIn: 'root'
})
export class ContratistaService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "contratista";
  private apiUrlInsumoXContratista = environment.apiURL + "insumoxcontratista";

  public obtenerTodos(idEmpresa: number){
    return this.httpClient.get<contratistaDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`);
  }
  public obtenerXId(id: number){
    return this.httpClient.get<contratistaDTO>(`${this.apiUrl}/${id}`);
  }
  public crearYObtener(registro: contratistaDTO, idEmpresa: number){
    return this.httpClient.post(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public editar(registro: contratistaDTO, idEmpresa: number): Observable<RespuestaDTO>{
    return this.httpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public borrar(idEmpresa: number, id: number): Observable<RespuestaDTO>{
    return this.httpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/${id}`);
  }

  public obtenerCuentasContables(idEmpresa : number, IdContratista : number){
    return this.httpClient.get<cuentaContableDTO[]>(`${this.apiUrl}/${idEmpresa}/cuentasContables/${IdContratista}`);
  }
}
