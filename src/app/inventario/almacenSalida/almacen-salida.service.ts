import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { almacenSalidaCreacionDTO, almacenSalidaDTO, insumosExistenciaDTO } from './tsAlmacenSalida';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class AlmacenSalidaService {

  constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "almacenSalida";

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<almacenSalidaDTO[]>(`${this.apiUrl}/todos`, {observe: 'response', params});
    }

    public ObtenXIdProyecto(idEmp:number, idProyecto:number){
      return this.HttpClient.get<almacenSalidaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdProyecto/${idProyecto}`)
    }

    public ObtenXIdProyectoSalidasConPrestamos(idEmp:number, idProyecto:number){
      return this.HttpClient.get<almacenSalidaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdProyectoSalidasConPrestamos/${idProyecto}`)
    }

    public obtenerInsumosDisponibles(idEmp:number, idAlmacen:number){
      return this.HttpClient.get<insumosExistenciaDTO[]>(`${this.apiUrl}/${idEmp}/obtenerInsumosDisponibles/${idAlmacen}`)
    }

    public obtenerTodosSinPaginar(){
        return this.HttpClient.get<almacenSalidaDTO[]>(`${this.apiUrl}/sinpaginar`)
    }

    public obtenerXId(id: number): Observable<almacenSalidaDTO>{
        return this.HttpClient.get<almacenSalidaDTO>(`${this.apiUrl}/${id}`)
    }

    public CrearAlmacenSalida(idEmp: number, registro: almacenSalidaCreacionDTO){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearAlmacenSalida`, registro);
    }

    public EditarAlmacenSalida(idEmp: number, registro: almacenSalidaDTO){
      return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EditarAlmacenSalida`, registro);
  }

    public editar(registro: almacenSalidaDTO){
        return this.HttpClient.put(`${this.apiUrl}`, registro);
    }

    public editarAutorizar(registro: almacenSalidaDTO){
        return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
    }

    public editarRemoverAutorizacion(registro: almacenSalidaDTO){
      return this.HttpClient.put(`${this.apiUrl}/removerautorizacion`, registro);
    }

    public cancelar(registro: almacenSalidaDTO){
      return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
    }

    public editarLiberar(registro: almacenSalidaDTO){
      return this.HttpClient.put(`${this.apiUrl}/liberar`, registro);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`);
    }
}
