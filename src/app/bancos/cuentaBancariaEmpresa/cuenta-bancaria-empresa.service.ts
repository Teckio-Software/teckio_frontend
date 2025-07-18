import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CuentaBancariaDTO } from './tsCuentaBancariaEmpresa';
import { Observable } from 'rxjs';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaEmpresaService {

  constructor(private http:HttpClient) { }

  private urlApi:string = environment.apiURL + "api/cuentabancaria/";

  ObtenerCuentasBancarias(idEmp:number): Observable<CuentaBancariaDTO[]>{
    return this.http.get<CuentaBancariaDTO[]>(`${this.urlApi}${idEmp}/ObtenTodos`)
   }

   ObtenerXId(id:number, idEmp:number):Observable<CuentaBancariaDTO>{
    return this.http.get<CuentaBancariaDTO>(`${this.urlApi}${idEmp}ObtenerXId/${id}`)
   }

   GuardarCuentaBancaria(cuentabancaria:CuentaBancariaDTO, idEmp:number):Observable<RespuestaDTO>{
    return this.http.post<RespuestaDTO>(`${this.urlApi}${idEmp}GuardarCuentaBancaria`, cuentabancaria)
   }

   GuardarYObtenerBanco(cuentabancaria:CuentaBancariaDTO, idEmp:number):Observable<CuentaBancariaDTO>{
    return this.http.post<CuentaBancariaDTO>(`${this.urlApi}${idEmp}GuardarYObtenCuentaBancaria`, cuentabancaria)
   }

   EditarCuentaBancaria(cuentabancaria:CuentaBancariaDTO, idEmp:number):Observable<RespuestaDTO>{
    return this.http.put<RespuestaDTO>(`${this.urlApi}${idEmp}EditarCuentaBancaria`, cuentabancaria)
   }

   EliminarCuentaBancaria(id:number, idEmp:number):Observable<RespuestaDTO>{
    return this.http.delete<RespuestaDTO>(`${this.urlApi}${idEmp}/${id}`,)
   }
}
