import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { insumoXOrdenCompraCreacionDTO, insumoXOrdenCompraDTO } from './tsInsumoXOrdenCompra';
import { ImpuestoInsumoOrdenCompraDTO, ordenCompraCreacionDTO } from '../orden-compra/tsOrdenCompra';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
})
export class InsumoXOrdenCompraService{

    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "insumoxordencompra"

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idOrdenCompra: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/todos/${idOrdenCompra}`, {observe: 'response', params});
    }
    public ObtenXIdRequisicion(idEmp:number, idRequisicion:number){
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdRequisicion/${idRequisicion}`)
    }

    public ObtenXIdCotizacion(idEmp:number, idCotizacion:number){
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdCotizacion/${idCotizacion}`)
    }

    public ObtenXIdOrdenCompra(idEmp:number, idOrdenCompra:number){
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdOrdenCompra/${idOrdenCompra}`)
    }
    
    public CrearInsumoOrdenCompra(idEmp:number, insumo : insumoXOrdenCompraCreacionDTO){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoOrdenCompra`, insumo)
    }

    public ObtenerImpuestosInsumoOrdenCompra(idEmp:number, idInsumoXOrdenCompra:number){
        return this.HttpClient.get<ImpuestoInsumoOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerImpuestosInsumoOrdenCompra/${idInsumoXOrdenCompra}`)
    }

    public obtenerXIdContratista(idEmp:number, idContratista: number, idProyecto : number){
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/obtenerXIdContratista/${idContratista}/${idProyecto}`);
    }


    public obtenerTodosSinPaginar(idOrdenCompra: number){
        return this.HttpClient.get<insumoXOrdenCompraDTO[]>(`${this.apiUrl}/sinpaginar/${idOrdenCompra}`);
    }

    public editar(registro: insumoXOrdenCompraDTO){
        return this.HttpClient.put(`${this.apiUrl}`, registro);
    }
}