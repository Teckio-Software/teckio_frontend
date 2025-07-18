import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {insumoXRequisicionCreacion, insumoXRequisicionDTO, listaInsumosRequisicionDTO } from './tsInsumoXRequisicion';
import { insumoXRequisicionBusquedaDTO } from './tsInsumoXRequisicion';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class InsumoXRequisicionService{
    
    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "insumoxrequisicion";

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idRequisicion: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<insumoXRequisicionCreacion[]>(`${this.apiUrl}/todos/${idRequisicion}`, {observe: 'response', params});
    }

     public obtenerTodosInsumosRequicicion(idEmp: number, idRequisicion:number){
        return this.HttpClient.get<insumoXRequisicionDTO[]>(`${this.apiUrl}/${idEmp}/sinpaginar/${idRequisicion}`)
     }

     public CrearInsumoXRequisicion(idEmp: number, insumo:insumoXRequisicionCreacion){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoXRequisicion`, insumo)
     }

    public obtenerTodosSinPaginar(idRequisicion: number){
        return this.HttpClient.get<insumoXRequisicionCreacion[]>(`${this.apiUrl}/sinpaginar/${idRequisicion}`)
    }

    public obtenerXId(id: number){
        return this.HttpClient.get<insumoXRequisicionCreacion>(`${this.apiUrl}/${id}`)
    }

    public obtenerPorDescripcionInsumo(insumoRequisicion: insumoXRequisicionBusquedaDTO): Observable<insumoXRequisicionCreacion[]>{
        return this.HttpClient.post<insumoXRequisicionCreacion[]>(`${this.apiUrl}/buscarPorNombre`, insumoRequisicion)
    }

    public EditarInsumoXRequisicion(idEmp: number, insumo:insumoXRequisicionDTO){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EditarInsumoXRequisicion`, insumo);
    }

    public EliminarInsumoXRequisicion(idEmp: number, Id :number){
        return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EliminarInsumoXRequisicion/${Id}`)
    }
}