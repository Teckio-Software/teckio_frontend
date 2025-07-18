import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ContratistaCuentaBancariaDTO, ContratistaCuentaBancariaCreacionDTO } from './tsContratistaCuentaBancaria';

@Injectable({
  providedIn: 'root'
})
export class ContratistaCuentaBancariaService {


  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "contratistacuentabancaria";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idContratista: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<ContratistaCuentaBancariaDTO[]>(`${this.apiUrl}/todos/${idContratista}`, {observe: 'response', params});
  }
  public obtenerTodosSinPaginar(){
    return this.httpClient.get<ContratistaCuentaBancariaDTO[]>(`${this.apiUrl}/sinpaginar`);
  }
  public obtenerXId(id: number): Observable<ContratistaCuentaBancariaDTO>{
    return this.httpClient.get<ContratistaCuentaBancariaDTO>(`${this.apiUrl}/${id}`);
  }
  public crear(registro: ContratistaCuentaBancariaCreacionDTO){
    return this.httpClient.post(this.apiUrl, registro);
  }
  public editar(registro: ContratistaCuentaBancariaDTO){
    return this.httpClient.put(`${this.apiUrl}`, registro);
  }
  public borrar(id: number){
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
