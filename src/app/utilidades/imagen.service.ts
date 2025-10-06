import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Imagen } from '../proyectos/precio-unitario/precio-unitario/imprimir-modal/ts.parametros-imprimir-pu';
import { RespuestaDTO } from './tsUtilidades';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  constructor(private HttpClient: HttpClient) {}

  private apiUrl = environment.apiURL + 'imagen';

  public obtenerImagen(idEmpresa: number) {
    return this.HttpClient.get<Imagen>(`${this.apiUrl}/${idEmpresa}/obtenerseleccionada`);
  }

  public cargarImagen(idEmpresa: number, formData: FormData) {
    return this.HttpClient.post<number>(`${this.apiUrl}/${idEmpresa}/CargarImagen`, formData);
  }

  public seleccionarImagen(idEmpresa: number, id: number){
    return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/SeleccionarImagen/${id}`);
  }

}
