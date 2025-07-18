import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import {
  requisicionDTO,
  requisicionCreacionDTO,
  InsumoProyectoBusquedaDTO,
  RequisicionBuscarDTO,
  RequisicionBusquedaExtensaDTO,
  listaRequisicionDTO,
} from './tsRequisicion';
import { precioUnitarioDTO } from 'src/app/proyectos/precio-unitario/tsPrecioUnitario';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { objetoRequisicionDTO } from '../cotizacion/tsCotizacion';

@Injectable({
  providedIn: 'root',
})
export class RequisicionService {
  constructor(private HttpClient: HttpClient) {}
  private apiUrl = environment.apiURL + 'requisicion';

  public obtenerPaginado(
    pagina: number,
    cantidadElementosAMostrar: number,
    idProyecto: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append(
      'recordsPorPagina',
      cantidadElementosAMostrar.toString()
    );
    return this.HttpClient.get<requisicionDTO[]>(
      `${this.apiUrl}/todos/${idProyecto}`,
      { observe: 'response', params }
    );
  }
  public obtenerXIdProyecto(
    IdEmp: number,
    IdProyecto: number
  ): Observable<listaRequisicionDTO[]> {
    return this.HttpClient.get<listaRequisicionDTO[]>(
      `${this.apiUrl}/${IdEmp}/ObtenerXIdProyecto/${IdProyecto}`
    );
  }

  public CrearObjetoRequisicion(IdEmp: number, idRequisicion: number) {
    return this.HttpClient.get<objetoRequisicionDTO>(
      `${this.apiUrl}/${IdEmp}/CrearObjetoRequisicion/${idRequisicion}`
    );
  }

  public obtenerTodosSinPaginar(idProyecto: number) {
    return this.HttpClient.get<requisicionDTO[]>(
      `${this.apiUrl}/sinpaginar/${idProyecto}`
    );
  }
  public obtenerTodosSinFiltroSinPaginar() {
    return this.HttpClient.get<requisicionDTO[]>(
      `${this.apiUrl}/sinpaginartodos`
    );
  }
  public sinpaginarcapturadosyautorizados() {
    return this.HttpClient.get<requisicionDTO[]>(
      `${this.apiUrl}/sinpaginarcapturadosyautorizados`
    );
  }
  public buscarXNoRequisicion(
    registro: RequisicionBuscarDTO
  ): Observable<requisicionDTO[]> {
    return this.HttpClient.post<requisicionDTO[]>(
      `${this.apiUrl}/filtradosinpaginar`,
      registro
    );
  }
  //Busqueda intensa de las requisiciones
  public buscarXBusquedaExtensa(
    registro: RequisicionBusquedaExtensaDTO
  ): Observable<any> {
    return this.HttpClient.post<requisicionDTO[]>(
      `${this.apiUrl}/busquedaextensa`,
      registro
    );
  }
  public obtenerXId(id: number): Observable<requisicionDTO> {
    return this.HttpClient.get<requisicionDTO>(`${this.apiUrl}/${id}`);
  }

  public CrearRequisicion(
    idEmp: number,
    registro: requisicionCreacionDTO
  ): Observable<RespuestaDTO> {
    return this.HttpClient.post<RespuestaDTO>(
      `${this.apiUrl}/${idEmp}/CrearRequisicion`,
      registro
    );
  }

  public EditarRequisicion(
    idEmp: number,
    registro: listaRequisicionDTO
  ): Observable<RespuestaDTO> {
    return this.HttpClient.put<RespuestaDTO>(
      `${this.apiUrl}/${idEmp}/EditarRequisicion`,
      registro
    );
  }
  //Autorizamos una requisición
  public editarAutorizar(registro: requisicionDTO) {
    return this.HttpClient.put(`${this.apiUrl}/autorizar`, registro);
  }

  public editarRemoverAutorizacion(registro: requisicionDTO) {
    return this.HttpClient.put(`${this.apiUrl}/removerautorizacion`, registro);
  }

  public cancelar(registro: requisicionDTO) {
    return this.HttpClient.put(`${this.apiUrl}/cancelar`, registro);
  }

  public editarLiberar(registro: requisicionDTO) {
    return this.HttpClient.put(`${this.apiUrl}/liberar`, registro);
  }

  public eliminar(IdEmp: number, idRequisicion: number) {
    return this.HttpClient.delete<RespuestaDTO>(
      `${this.apiUrl}/${IdEmp}/eliminar/${idRequisicion}`
    );
  }
}
