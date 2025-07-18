import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { cuentaContableCreacionDTO, cuentaContableGastosDTO } from './tsConf-cuenta-contable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class cuentaContableService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "CuentasContablesGastos";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<cuentaContableGastosDTO[]>(`${this.zvApiUrl}/0/ObtenerCuentasContables`);
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<cuentaContableGastosDTO[]>(`${this.zvApiUrl}/0/ObtenerCuentasContables`);
  }
  public crear(registro: cuentaContableGastosDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/Crear`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<cuentaContableGastosDTO>{
    return this.httpClient.get<cuentaContableGastosDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
  public editar(registro: cuentaContableGastosDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/Editar`, registro);
  }
}
