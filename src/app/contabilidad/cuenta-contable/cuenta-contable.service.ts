import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { cuentaContableCatalogoDTO, cuentaContableCreacionDTO, cuentaContableDTO, cuentaContableObtenCodigo } from './tsCuentaContable';

@Injectable({
  providedIn: 'root'
})
export class CuentaContableService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "cuentacontable";

  public obtenerTodosSinPaginar(idEmpresa: number): Observable<any>{
    return this.httpClient.get<cuentaContableDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`);
  }
  public obtenerAsignables(idEmpresa: number): Observable<any>{
    return this.httpClient.get<cuentaContableDTO[]>(`${this.apiUrl}/${idEmpresa}/asignables`);
  }

  public obtenerTodosSinEstructura(idEmpresa: number): Observable<any>{
    return this.httpClient.get<cuentaContableDTO[]>(`${this.apiUrl}/${idEmpresa}/todossinestructura`);
  }

  public obtenerTodosParaCatalogo(idEmpresa: number): Observable<any>{
    return this.httpClient.get<cuentaContableCatalogoDTO[]>(`${this.apiUrl}/${idEmpresa}/paracatalogo`);
  }
  public obtenerXIdEmpresaYCodigo(codigo: string, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('codigo', codigo.toString());
    return this.httpClient.get<cuentaContableCatalogoDTO>(`${this.apiUrl}/${idEmpresa}/obtenxcodigo`, {observe: 'response', params});
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<cuentaContableDTO>{
    return this.httpClient.get<cuentaContableDTO>(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
  public crear(registro: cuentaContableCreacionDTO, idEmpresa: number){
    return this.httpClient.post<cuentaContableDTO>(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public creaYObtenCodigo(registro: cuentaContableCreacionDTO, idEmpresa: number): Observable<any> {
    return this.httpClient.post<cuentaContableObtenCodigo>(`${this.apiUrl}/${idEmpresa}/creayobtencodigo`, registro);
  }
  public crearyObtener(registro: cuentaContableCreacionDTO, idEmpresa: number): Observable<any>{
    return this.httpClient.post<cuentaContableDTO>(`${this.apiUrl}/${idEmpresa}/crearyobtener`, registro)
  }
  public editar(registro: cuentaContableDTO, idEmpresa: number){
    return this.httpClient.put(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public borrar(id: number, idEmpresa: number){
    return this.httpClient.delete(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
}
