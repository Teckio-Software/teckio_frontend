import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CompraDirectaDTO, CompraDirectaCreacionDTO } from './tsComprasDirectas';

@Injectable({
  providedIn: 'root'
})
export class ComprasdirectasService {

  constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "compradirecta";

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<CompraDirectaDTO[]>(`${this.apiUrl}/todos`, {observe: 'response', params});
    }

    public obtenerTodosSinPaginar(){
        return this.HttpClient.get<CompraDirectaDTO[]>(`${this.apiUrl}/sinpaginar`)
    }

    public obtenerXId(id: number): Observable<CompraDirectaDTO>{
        return this.HttpClient.get<CompraDirectaDTO>(`${this.apiUrl}/${id}`)
    }

    public crear(registro: CompraDirectaCreacionDTO){
        return this.HttpClient.post(this.apiUrl, registro);
    }

    public editar(registro: CompraDirectaDTO){
        return this.HttpClient.put(`${this.apiUrl}`, registro);
    }

    public editarAutorizar(registro: CompraDirectaDTO){
        return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
    }

    public editarRemoverAutorizacion(registro: CompraDirectaDTO){
      return this.HttpClient.put(`${this.apiUrl}/removerautorizacion`, registro);
    }

    public cancelar(registro: CompraDirectaDTO){
      return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
    }

    public editarLiberar(registro: CompraDirectaDTO){
      return this.HttpClient.put(`${this.apiUrl}/liberar`, registro);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`);
    }
}
