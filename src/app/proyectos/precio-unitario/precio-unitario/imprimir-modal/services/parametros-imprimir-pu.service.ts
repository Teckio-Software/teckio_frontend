import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ParametrosImpresionPu } from './../ts.parametros-imprimir-pu';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({ providedIn: 'root' })
export class ParametrosImprimirPuService {
  private apiUrl = environment.apiURL + 'parametrosImpresionPu';
  constructor(private HttpClient: HttpClient) {}

  /**
   * Obtiene todos los parámetros de impresión configurados para la empresa
   * especificada.
   *
   * @param idEmpresa Identificador de la empresa para la que se desean obtener
   * los par ametros de impresi n.
   *
   * @returns Un Observable que emite un array de objetos de tipo
   * `ParametrosImpresionPu` con los par ametros de impresi n configurados para
   * la empresa.
   */
  public obtenerTodos(idEmpresa: number): Observable<ParametrosImpresionPu[]> {
    return this.HttpClient.get<ParametrosImpresionPu[]>(
      `${this.apiUrl}/${idEmpresa}/todos`
    );
  }

  /**
   * Obtiene los parámetros de impresión configurados para el cliente
   * especificado y la empresa indicada.
   *
   * @param idEmpresa Identificador de la empresa para la que se desean obtener
   * los par ametros de impresi n.
   *
   * @param idCliente Identificador del cliente para el que se desean obtener los
   * par ametros de impresi n.
   *
   * @returns Un Observable que emite un array de objetos de tipo
   * `ParametrosImpresionPu` con los par ametros de impresi n configurados para
   * el cliente y la empresa.
   */
  public obtenerXCliente(
    idEmpresa: number,
    idCliente: number
  ): Observable<ParametrosImpresionPu[]> {
    return this.HttpClient.get<ParametrosImpresionPu[]>(
      `${this.apiUrl}/${idEmpresa}/obtenerXcliente/${idCliente}`
    );
  }

  public crearConImagen(
    idEmpresa: number,
    formData: FormData
  ): Observable<RespuestaDTO> {
    return this.HttpClient.post<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/crearConImagen`,
      formData
    );
  }

  public editarConImagen(
    idEmpresa: number,
    formData: FormData
  ): Observable<RespuestaDTO> {
    return this.HttpClient.put<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/editarConImagen`,
      formData
    );
  }

  /**
   * Edita un registro de parámetros de impresión.
   *
   * @param idEmpresa Identificador de la empresa que contiene el registro a editar.
   * @param parametros Parámetros de impresión que se van a editar.
   *
   * @returns Un Observable que emite un objeto de tipo `RespuestaDTO` con el
   * resultado de la edición del registro de parámetros de impresión.
   */
  public editar(
    idEmpresa: number,
    parametros: ParametrosImpresionPu
  ): Observable<RespuestaDTO> {
    return this.HttpClient.put<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/editar`,
      parametros
    );
  }

  /**
   * Elimina un registro de parámetros de impresión por su id.
   *
   * @param idEmpresa Identificador de la empresa que contiene el registro a eliminar.
   * @param id Identificador del registro a eliminar.
   *
   * @returns Un Observable que emite un objeto de tipo `RespuestaDTO` con el resultado
   * de la eliminación.
   */
  public eliminar(idEmpresa: number, id: number): Observable<RespuestaDTO> {
    return this.HttpClient.delete<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/eliminar/${id}`
    );
  }

  /**
   * Crea un nuevo registro de parámetros de impresión.
   *
   * @param idEmpresa Identificador de la empresa para la que se va a crear el
   * registro de parámetros de impresión.
   *
   * @param parametros Parámetros de impresión que se van a crear.
   *
   * @returns Un Observable que emite un objeto de tipo `RespuestaDTO` con el
   * resultado de la creación del registro de parámetros de impresión.
   */
  public crear(
    idEmpresa: number,
    parametros: ParametrosImpresionPu
  ): Observable<RespuestaDTO> {
    return this.HttpClient.post<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/crear`,
      parametros
    );
  }
}
