import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { plazaEmpleadoCreacionDTO, plazaEmpleadoDTO } from './tsConf-plaza-div';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class plazaEmpleadoService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "EmpleadoGastos";
  
  public obtenerPaginado(idEmpleado: number, pagina: number, cantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<plazaEmpleadoDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazaEmpleados/${idEmpleado}`);
  }
  public obtenerTodosSinPaginar( idEmpleado: number, idEmpresa: number){
    return this.httpClient.get<plazaEmpleadoDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazaEmpleados/${idEmpleado}`);
  }
  public crear(registro: plazaEmpleadoDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearRelaciónPlazaEmpleado`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<plazaEmpleadoDTO>{
    return this.httpClient.get<plazaEmpleadoDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }
  public editar(registro: plazaEmpleadoDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/Editar`, registro);
  }
}
