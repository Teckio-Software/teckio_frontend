import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CuentaBancariaBaseDTO, CuentaBancariaEmpresaDTO } from '../cuentabancaria';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class CuentabancariaEmpresaService {

  constructor(private http : HttpClient) { }

  private apiUrl = environment.apiURL + "cuentabancariaempresa";

  public CrearCuentaBancaria(idEmpresa : number, cuentaBancaria : CuentaBancariaEmpresaDTO){
    return this.http.post<boolean>(`${this.apiUrl}/${idEmpresa}/GuardarCuentaBancaria`, cuentaBancaria);
  }

  public ObtenerTodos(idEmpresa : number){
    return this.http.get<CuentaBancariaBaseDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerTodos`);
  }

  public AsignarCuentaContable(idEmpresa : number, cuentaBancariaEmpresa : CuentaBancariaEmpresaDTO){
    return this.http.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/AsignarCuentaContable`, cuentaBancariaEmpresa);
  }
}