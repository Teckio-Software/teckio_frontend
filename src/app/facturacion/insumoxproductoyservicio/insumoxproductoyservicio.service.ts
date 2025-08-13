import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { InsumoXProductoYServicioDTO } from './ts.insumoxproductoyservicio';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({providedIn: 'root'})
export class InsumoXProductoYServicioService {

    constructor(private httpClient: HttpClient) { }
      private apiUrl = environment.apiURL + "insumoxproductoyservicio";

      public obtenerPorProdyser(idEmpresa:number, idProdySer: number){
            return this.httpClient.get<InsumoXProductoYServicioDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerXIdProdYSer/${idProdySer}`);
      }

      public crear(idEmpresa:number, insumo: InsumoXProductoYServicioDTO){
            return this.httpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/crear`,insumo);
      }

      public eliminar(idEmpresa:number, insumo: number){
            return this.httpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/eliminar/`+insumo);
      }
}