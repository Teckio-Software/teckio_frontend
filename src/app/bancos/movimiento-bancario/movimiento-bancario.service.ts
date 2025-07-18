
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MovimientoBancarioTeckioDTO } from './tsMovimientoBancario';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class MovimientoBancarioService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "movimientobancario";

  public crear(idEmpresa : number, registro: MovimientoBancarioTeckioDTO){
    return this.httpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/CrearMovimientoBancario`, registro);
  }

  public ObtenerXIdCuentaBancaria(idEmpresa : number, IdCuentaBancaria: number){
    return this.httpClient.get<MovimientoBancarioTeckioDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerXIdCuentaBancaria/${IdCuentaBancaria}`);
  }

  public ObtenerXIdCuentaBancariaYFiltro(idEmpresa : number, IdCuentaBancaria: number, fechaInicio : string, fechaFin : string){
    const formData =  new FormData();
    formData.append('IdCuentaBancaria', IdCuentaBancaria.toString());
    formData.append('fechaInicio', fechaInicio.toString());
    formData.append('fechaFin', fechaFin.toString());
    return this.httpClient.post<MovimientoBancarioTeckioDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerXIdCuentaBancariaYFiltro`, formData);
  }

  public AutorizarMovimientoBancario(idEmpresa : number, IdMovimientoBancario: number){
    return this.httpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/AutorizarMovimientoBancario/${IdMovimientoBancario}`);
  }

  public CancelarXIdMovimientoBancario(idEmpresa : number, IdMovimientoBancario: number){
    return this.httpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/CancelarXIdMovimientoBancario/${IdMovimientoBancario}`);
  }

  
}
