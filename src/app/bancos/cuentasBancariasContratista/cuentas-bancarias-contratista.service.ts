import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { contratistaCuentaBancariaCreacionDTO, contratistaCuentaBancariaDTO } from './tsCuentaBancariaContratista';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasContratistaService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "contratistacuentabancaria";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idContratista:number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<contratistaCuentaBancariaDTO[]>(`${this.apiUrl}/todos/${idContratista}`, {observe: 'response', params});
  }
  public obtenerTodosSinPaginar(idContratista: number){
    return this.httpClient.get<contratistaCuentaBancariaDTO[]>(`${this.apiUrl}/sinpaginar/${idContratista}`);
  }
  public obtenerXId(id: number): Observable<contratistaCuentaBancariaDTO>{
    return this.httpClient.get<contratistaCuentaBancariaDTO>(`${this.apiUrl}/${id}`);
  }
  public crear(registro: contratistaCuentaBancariaCreacionDTO){
    return this.httpClient.post(this.apiUrl, registro);
  }
  public editar(registro: contratistaCuentaBancariaDTO){
    return this.httpClient.put(`${this.apiUrl}`, registro);
  }
  public borrar(id: number){
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
