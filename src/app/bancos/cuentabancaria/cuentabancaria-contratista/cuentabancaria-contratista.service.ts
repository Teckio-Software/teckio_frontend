import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CuentaBancariaBaseDTO, CuentaBancariaContratistaDTO } from '../cuentabancaria';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class CuentabancariaContratistaService {

  constructor(private http : HttpClient) { }

  private apiUrl = environment.apiURL + "cuentabancaria";

  public CrearCuentaBancaria(idEmpresa : number, cuentaBancaria : CuentaBancariaContratistaDTO){
    return this.http.post<boolean>(`${this.apiUrl}/${idEmpresa}/GuardarCuentaBancaria`, cuentaBancaria);
  }

  public ObtenerXIdContratista(idEmpresa : number, IdContratista : number){
    return this.http.get<CuentaBancariaBaseDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerXIdContratista/${IdContratista}`);
  }
}
