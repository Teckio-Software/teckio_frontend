import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AlmacenEntradaInsumoCreacionDTO, AlmacenEntradaInsumosDTO } from './tsAlmacenEntradaInsumo';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class AlmacenEntradaInsumoService {

  constructor(private HttpClient: HttpClient){}
  private apiUrl = environment.apiURL + "almacenentradainsumo";

  public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idAlmacenEntrada: number): Observable<any>{
      let params = new HttpParams();
      params = params.append('pagina', pagina.toString());
      params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
      return this.HttpClient.get<AlmacenEntradaInsumosDTO[]>(`${this.apiUrl}/todos/${idAlmacenEntrada}`, {observe: 'response', params});
  }

  public obtenerTodosSinPaginar(idAlmacenEntrada: number){
      return this.HttpClient.get<AlmacenEntradaInsumosDTO[]>(`${this.apiUrl}/sinpaginar/${idAlmacenEntrada}`)
  }
  public ObtenXIdProyecto(idEmp:number, idProyecto:number){
    return this.HttpClient.get<AlmacenEntradaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdProyecto/${idProyecto}`)
}
  public ObtenXIdRequisicion(idEmp:number, idRequisicion:number){
    return this.HttpClient.get<AlmacenEntradaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdRequisicion/${idRequisicion}`)
}
public ObtenXIdEntradaAlmacen(idEmp:number, idEntradaAlmacen:number){
  return this.HttpClient.get<AlmacenEntradaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdEntradaAlmacen/${idEntradaAlmacen}`)
}

  public obtenerXId(id: number): Observable<AlmacenEntradaInsumosDTO>{
      return this.HttpClient.get<AlmacenEntradaInsumosDTO>(`${this.apiUrl}/${id}`)
  }

  public CrearInsumoEntradaAlmacen(idEmp:number, registro: AlmacenEntradaInsumoCreacionDTO){
      return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoEntradaAlmacen`, registro);
  }
  public CrearInsumoAjusteAlmacen(idEmp:number, registro: AlmacenEntradaInsumoCreacionDTO){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoAjusteAlmacen`, registro);
}

  public editar(registro: AlmacenEntradaInsumosDTO){
      return this.HttpClient.put(`${this.apiUrl}`, registro);
  }

  public editarAutorizar(registro: AlmacenEntradaInsumosDTO){
      return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
  }

  public editarRemoverAutorizacion(registro: AlmacenEntradaInsumosDTO){
    return this.HttpClient.put(`${this.apiUrl}/removerautorizacion`, registro);
  }

  public cancelar(registro: AlmacenEntradaInsumosDTO){
    return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
  }

  public editarLiberar(registro: AlmacenEntradaInsumosDTO){
    return this.HttpClient.put(`${this.apiUrl}/liberar`, registro);
  }

  public borrar(id: number){
      return this.HttpClient.delete(`${this.apiUrl}/${id}`);
  }
}
