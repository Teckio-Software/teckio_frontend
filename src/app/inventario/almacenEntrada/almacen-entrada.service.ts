import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AlmacenEntradaCreacionDTO, AlmacenEntradaDevolucionCreacionDTO, AlmacenEntradaDTO } from './tsAlmacenEntrada';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class AlmacenEntradaService {

  constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "almacenentrada";

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/todos`, {observe: 'response', params});
    }

    public obtenerTodosSinPaginar(){
        return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/sinpaginar`)
    }
    public ObtenXIdProyecto(idEmp:number, idProyecto:number){
      return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdProyecto/${idProyecto}`)
  }

    public ObtenXIdRequisicion(idEmp:number, idRequisicion:number){
      return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdRequisicion/${idRequisicion}`)
  }
  public ObtenXIdCotizacion(idEmp:number, idCotizacion:number){
    return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdCotizacion/${idCotizacion}`)
}
public ObtenXIdOrdenCompra(idEmp:number, idOrdenCompra:number){
  return this.HttpClient.get<AlmacenEntradaDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdOrdenCompra/${idOrdenCompra}`)
}
    public obtenerXId(id: number): Observable<AlmacenEntradaDTO>{
        return this.HttpClient.get<AlmacenEntradaDTO>(`${this.apiUrl}/${id}`)
    }

    public crear(idEmp : number, registro: AlmacenEntradaCreacionDTO){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearAlmacenEntrada`, registro);
    }

    public CrearAjusteEntradaAlmacen(idEmp : number, registro: AlmacenEntradaCreacionDTO){
      return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearAjusteEntradaAlmacen`, registro);
  }

  public CrearDevolucionEntradaAlmacen(idEmp : number, registro: AlmacenEntradaDevolucionCreacionDTO){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearDevolucionEntradaAlmacen`, registro);
}

    public EditarAlmacenEntrada(idEmp : number, registro: AlmacenEntradaDTO){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EditarAlmacenEntrada`, registro);
    }

    public editarAutorizar(registro: AlmacenEntradaDTO){
        return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
    }

    public editarRemoverAutorizacion(registro: AlmacenEntradaDTO){
      return this.HttpClient.put(`${this.apiUrl}/removerautorizacion`, registro);
    }

    public cancelar(registro: AlmacenEntradaDTO){
      return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
    }

    public editarLiberar(registro: AlmacenEntradaDTO){
      return this.HttpClient.put(`${this.apiUrl}/liberar`, registro);
    }

    public borrar(id: number){
        return this.HttpClient.delete(`${this.apiUrl}/${id}`);
    }
}
