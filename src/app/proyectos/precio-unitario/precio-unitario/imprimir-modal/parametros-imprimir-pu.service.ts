import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ParametrosImpresionPu } from './ts.parametros-imprimir-pu';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({ providedIn: 'root' })
export class ParametrosImprimirPuService {
  private apiUrl = environment.apiURL + 'parametrosImpresionPu';
  constructor(private HttpClient: HttpClient) {}

  public obtenerTodos(idEmpresa: number): Observable<ParametrosImpresionPu[]> {
    return this.HttpClient.get<ParametrosImpresionPu[]>(
      `${this.apiUrl}/${idEmpresa}/todos`
    );
  }

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

  public editar(
    idEmpresa: number,
    parametros: ParametrosImpresionPu
  ): Observable<RespuestaDTO> {
    return this.HttpClient.put<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/editar`,
      parametros
    );
  }

  public eliminar(idEmpresa: number, id: number): Observable<RespuestaDTO> {
    return this.HttpClient.delete<RespuestaDTO>(
      `${this.apiUrl}/${idEmpresa}/eliminar/${id}`
    );
  }

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
