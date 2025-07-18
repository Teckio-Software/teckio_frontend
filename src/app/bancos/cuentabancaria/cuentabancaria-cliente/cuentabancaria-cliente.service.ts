import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CuentaBancariaBaseDTO, CuentaBancariaClienteDTO } from '../cuentabancaria';

@Injectable({
  providedIn: 'root'
})
export class CuentabancariaClienteService {

  constructor(private http : HttpClient) { }

  private apiUrl = environment.apiURL + "cuentabancariacliente";

  public CrearCuentaBancaria(idEmpresa : number, cuentaBancaria : CuentaBancariaClienteDTO){
    return this.http.post<boolean>(`${this.apiUrl}/${idEmpresa}/GuardarCuentaBancaria`, cuentaBancaria);
  }

  public ObtenerXIdCliente(idEmpresa : number, IdCliente : number){
    return this.http.get<CuentaBancariaBaseDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerXIdCliente/${IdCliente}`);
  }
}
