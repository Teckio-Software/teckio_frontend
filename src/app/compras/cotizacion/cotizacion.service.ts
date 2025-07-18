import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { cotizacion, cotizacionCreacionDTO, cotizacionDTO, cotizacionEditaEstatusDTO, TipoImpuestoDTO } from './tsCotizacion';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { insumoXOrdenCompraDTO } from '../insumoxordencompra/tsInsumoXOrdenCompra';

@Injectable({
    providedIn: 'root'
})
export class CotizacionService{
    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "cotizacion";

    public obtenerPorProyectoPaginado(pagina: number, cantidadElementosAMostrar: number, idProyecto: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<cotizacionDTO[]>(`${this.apiUrl}/todos/${idProyecto}`, {observe: 'response', params});
    }

    public obtenerPorRequisicionPaginado(pagina: number, cantidadElementosAMostrar: number, idProyecto: number, idRequisicion: number): Observable<any>{
      let params = new HttpParams();
      params = params.append('pagina', pagina.toString());
      params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
      return this.HttpClient.get<cotizacionDTO[]>(`${this.apiUrl}/todosrequisicion/${idProyecto}/${idRequisicion}`, {observe: 'response', params});
    }

    
    public ObtenXIdRequisicion(idEmp:number, idRequisicion:number){
        return this.HttpClient.get<cotizacionDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdRequisicion/${idRequisicion}`)
    }
    public obtenerTodosSinPaginar(idProyecto: number){
        return this.HttpClient.get<cotizacionDTO[]>(`${this.apiUrl}/sinpaginar/${idProyecto}`)
    }

    public AutorizarTodos(idEmp:number, idCotizacion:number){
        return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmp}/AutorizarTodos/${idCotizacion}`)
    }

    public obtenerXId(idEmp:number, id: number): Observable<cotizacionDTO>{
        return this.HttpClient.get<cotizacionDTO>(`${this.apiUrl}/${idEmp}/ObtenerXId/${id}`)
    }

    public crear(registro: cotizacionCreacionDTO){
        return this.HttpClient.post(this.apiUrl, registro);
    }

    public CrearCotizacion(idEmp:number,registro: cotizacionCreacionDTO):Observable<RespuestaDTO>{
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearCotizacion`, registro);
    }

    public EditarCotizacion(idEmp:number,registro: cotizacionDTO):Observable<RespuestaDTO>{
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EditarCotizacion`, registro);
    }

    public ActualizarInsumosXCotizacion(idEmp:number, registro: cotizacion){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/ActualizarInsumosCotizados`, registro);
    }

    public autorizaEstatusCotizacion(editaEstatus: cotizacionEditaEstatusDTO){
        return this.HttpClient.put(`${this.apiUrl}/autorizar`, editaEstatus);
    }

    public cancelaEstatusCotizacion(editaEstatus: cotizacionEditaEstatusDTO){
        return this.HttpClient.put(`${this.apiUrl}/cancelar`, editaEstatus);
    }

    public compraEstatusCotizacion(editaEstatus: cotizacionEditaEstatusDTO){
        return this.HttpClient.put(`${this.apiUrl}/comprar`, editaEstatus);
    }

    public removerEstatusCotizacion(editaEstatus: cotizacionEditaEstatusDTO){
        return this.HttpClient.put(`${this.apiUrl}/remover`, editaEstatus);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`);
    }

    public ObtenerImpuestos(idEmp:number){
        return this.HttpClient.get<TipoImpuestoDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerImpuestos`);
    }
}
