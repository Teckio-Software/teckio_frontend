import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { almacenSalidaInsumosCreacionDTO, almacenSalidaInsumosDTO } from './tsAlmacenSalidaInsumos';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class AlmacenSalidaInsumosService {

  constructor(private HttpClient: HttpClient){}
  private apiUrl = environment.apiURL + "almacenSalidainsumo";

  public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idAlmacenSalida: number): Observable<any>{
      let params = new HttpParams();
      params = params.append('pagina', pagina.toString());
      params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
      return this.HttpClient.get<almacenSalidaInsumosDTO[]>(`${this.apiUrl}/todos/${idAlmacenSalida}`, {observe: 'response', params});
  }

  public ObtenXIdProyecto(idEmp:number, idProyecto:number){
    return this.HttpClient.get<almacenSalidaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdProyecto/${idProyecto}`)
}
public ObtenXIdSalidaAlmacen(idEmp:number, idSalidaAlmacen:number){
  return this.HttpClient.get<almacenSalidaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdSalidaAlmacen/${idSalidaAlmacen}`)
}

public ObtenXIdAlmacenYPrestamo(idEmp:number, idAlmacen:number){
  return this.HttpClient.get<almacenSalidaInsumosDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdAlmacenYPrestamo/${idAlmacen}`)
}

public CrearInsumoSalidaAlmacen(idEmp:number, registro: almacenSalidaInsumosCreacionDTO){
  return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearInsumoSalidaAlmacen`, registro);
}

  public obtenerTodosSinPaginar(idAlmacenSalida: number){
      return this.HttpClient.get<almacenSalidaInsumosDTO[]>(`${this.apiUrl}/sinpaginar/${idAlmacenSalida}`)
  }

  public obtenerXId(id: number): Observable<almacenSalidaInsumosDTO>{
      return this.HttpClient.get<almacenSalidaInsumosDTO>(`${this.apiUrl}/${id}`)
  }

  public crear(registro: almacenSalidaInsumosCreacionDTO){
      return this.HttpClient.post(this.apiUrl, registro);
  }

  public editar(registro: almacenSalidaInsumosDTO){
      return this.HttpClient.put(`${this.apiUrl}`, registro);
  }
  //Para entrar al endPoint para autorizar un insumo
  public editarAutorizar(registro: almacenSalidaInsumosDTO){
    return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
  }
  public editarCancelar(registro: almacenSalidaInsumosDTO){
    return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
  }

  public borrar(id: number){
      return this.HttpClient.delete(`${this.apiUrl}/${id}`);
  }
}
