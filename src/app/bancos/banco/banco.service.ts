import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BancoDTO } from './tsBanco';
import { Observable } from 'rxjs';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private http:HttpClient) {

   }

   private urlApi:string = environment.apiURL + "Banco/";

   ObtenerBancos(idEmpresa:number): Observable<BancoDTO[]>{
    return this.http.get<BancoDTO[]>(`${this.urlApi}${idEmpresa}/ObtenerTodos`)
   }

   ObtenerXId(id:number):Observable<BancoDTO>{
    return this.http.get<BancoDTO>(`${this.urlApi}ObtenerXId/${id}`)
   }

   ObtenerXClave(clave:string):Observable<BancoDTO>{
    return this.http.get<BancoDTO>(`${this.urlApi}ObtenerXClave/${clave}`)
   }

   GuardarBanco(idEmpresa:number, banco:BancoDTO):Observable<RespuestaDTO>{
    return this.http.post<RespuestaDTO>(`${this.urlApi}${idEmpresa}/GuardarBanco`, banco)
   }

   GuardarYObtenerBanco(banco:BancoDTO):Observable<BancoDTO>{
    return this.http.post<BancoDTO>(`${this.urlApi}GuardarYObtenerBanco`, banco)
   }

   EditarBanco(idEmpresa:number, banco:BancoDTO):Observable<RespuestaDTO>{
    return this.http.put<RespuestaDTO>(`${this.urlApi}${idEmpresa}/EditarBanco`, banco)
   }

   EliminarBanco(idEmpresa:number,id:number):Observable<RespuestaDTO>{
    return this.http.delete<RespuestaDTO>(`${this.urlApi}${idEmpresa}/${id}`,)
   }

}
