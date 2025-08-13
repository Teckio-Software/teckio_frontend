import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { InsumoXProductoYServicioDTO } from './ts.insumoxproductoyservicio';

@Injectable({providedIn: 'root'})
export class InsumoXProductoYServicioService {

    constructor(private httpClient: HttpClient) { }
      private apiUrl = environment.apiURL + "insumoxproductoyservicio";

      public obtenerPorProdyser(idEmpresa:number, idProdySer: number){
            return this.httpClient.get<InsumoXProductoYServicioDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerXIdProdYSer/${idProdySer}`);
        
      }
}