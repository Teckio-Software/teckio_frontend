import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { insumoXRequisicionCreacion } from "../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion";
import { editaEstatusInsumoXCotizacionDTO, insumoXCotizacionDTO, listaInsumoXCotizacionDTO } from "./tsInsumoXCotizacion";
import { RespuestaDTO } from "src/app/utilidades/tsUtilidades";
import { TipoImpuestoDTO, ImpuestoInsumoCotizadoDTO, insumosXCotizacion, InsumoXCotizacionCreacionDTO } from "../cotizacion/tsCotizacion";

@Injectable({
    providedIn: 'root'
})
export class InsumoXCotizacionService{

    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "insumoxcotizacion"

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idCotizacion: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<insumoXCotizacionDTO[]>(`${this.apiUrl}/todos/${idCotizacion}`, {observe: 'response', params});
    }

    public obtenerTodosSinPaginar(idCotizacion: number){
        return this.HttpClient.get<insumoXCotizacionDTO[]>(`${this.apiUrl}/sinpaginar/${idCotizacion}`)
    }

    public ObtenTodos(idEmp : number, idRequisicion:number, idProyecto:number){
        return this.HttpClient.get<insumoXCotizacionDTO[]>(`${this.apiUrl}/${idEmp}/ObtenTodos/${idRequisicion}/${idProyecto}`,)
    }

    public CrearInsumoCotizado(idEmp : number, parametros : InsumoXCotizacionCreacionDTO){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoCotizado`, parametros)
    }

    public EditarInsumoCotizado(idEmp : number, parametros : InsumoXCotizacionCreacionDTO){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoCotizado`, parametros)
    }

    public ObtenXIdCotizacion(idEmp:number, idCotizacion:number){
        return this.HttpClient.get<insumoXCotizacionDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdCotizacion/${idCotizacion}`)
    }

    public ObtenXIdCotizacionNoComprados(idEmp:number, idCotizacion:number){
        return this.HttpClient.get<insumoXCotizacionDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdCotizacionNoComprados/${idCotizacion}`)
    }

    public AutorizarXId(idEmp:number, idInsumoXCotizacion:number){
        return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmp}/AutorizarXId/${idInsumoXCotizacion}`)
    }

    public RemoverAutorizacion(idEmp:number, idInsumoXCotizacion:number){
        return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmp}/RemoverAutorizacion/${idInsumoXCotizacion}`)
    }

    public AutorizarInsumosCotizadosSeleccionados(idEmp: number, seleccionados : insumoXCotizacionDTO[]){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/AutorizarInsumosCotizadosSeleccionados`, seleccionados)
    }

    public CrearImpuestosInsumoCotizado(idEmp: number, impuestos : ImpuestoInsumoCotizadoDTO[], IdInsumoCotizado : number){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearImpuestosInsumoCotizado/${IdInsumoCotizado}`, impuestos)
    }

    public EliminarImpuestoInsumoCotizado(idEmp: number, IdInsumoCotizado : number, idTipoImpuesto : number){
        return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EliminarImpuestoInsumoCotizado/${IdInsumoCotizado}/${idTipoImpuesto}`)
    }

    public obtenerXId(id: number){
        return this.HttpClient.get<insumoXCotizacionDTO>(`${this.apiUrl}/${id}`)
    }

    public ActualizarInsumoXCotizacion(idEmp:number, registro: insumosXCotizacion){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/ActualizarInsumoXCotizacion`, registro);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`)
    }

    public autorizaEstatusIXC(editaEstatus: editaEstatusInsumoXCotizacionDTO){
        return this.HttpClient.put(`${this.apiUrl}/autorizar`, editaEstatus);
    }

    public cancelaEstatusIXC(editaEstatus: editaEstatusInsumoXCotizacionDTO){
        return this.HttpClient.put(`${this.apiUrl}/cancelar`, editaEstatus);
    }

    public compraEstatusIXC(editaEstatus: editaEstatusInsumoXCotizacionDTO){
        return this.HttpClient.put(`${this.apiUrl}/comprar`, editaEstatus);
    }

    public removerEstatusIXC(editaEstatus: editaEstatusInsumoXCotizacionDTO){
        return this.HttpClient.put(`${this.apiUrl}/remover`, editaEstatus);
    }
}