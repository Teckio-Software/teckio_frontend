import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CompraDirectaInsumoDTO, CompraDirectaInsumoCreacionDTO } from './tsComprasDirectasInsumos';

@Injectable({
  providedIn: 'root'
})
export class ComprasdirectasinsumosService {

  constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "compradirectainsumos";

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idCompraDirecta: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<CompraDirectaInsumoDTO[]>(`${this.apiUrl}/todos/${idCompraDirecta}`, {observe: 'response', params});
    }

    public obtenerTodosSinPaginar(idCompraDirecta: number){
        return this.HttpClient.get<CompraDirectaInsumoDTO[]>(`${this.apiUrl}/sinpaginar/${idCompraDirecta}`)
    }

    public obtenerXId(id: number): Observable<CompraDirectaInsumoDTO>{
        return this.HttpClient.get<CompraDirectaInsumoDTO>(`${this.apiUrl}/${id}`)
    }

    public crear(registro: CompraDirectaInsumoCreacionDTO, idCompraDirecta: number){
        return this.HttpClient.post(`${this.apiUrl}/${idCompraDirecta}`, registro);
    }

    public editar(registro: CompraDirectaInsumoDTO, idCompraDirecta: number){
        return this.HttpClient.put(`${this.apiUrl}/${idCompraDirecta}`, registro);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`);
    }
}
