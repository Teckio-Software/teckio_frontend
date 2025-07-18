import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { usuarioUltimaSeccion } from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioUltimaSeccionService {
  zvApiUrl = environment.ssoApi + 'UsuarioUltimaSeccion';

  constructor(private httpClient: HttpClient) { }


  obtenerUltimaSeccionUsuarioXIUsuario(idUsuario: number) {
    return this.httpClient.get<usuarioUltimaSeccion>(`${this.zvApiUrl}/obtenrXIdUsuario/${idUsuario}`);
  }

  crearUltimaSeccionUsuario(parametro: any) {
    return this.httpClient.post<usuarioUltimaSeccion>(`${this.zvApiUrl}/crearUsuarioUltimaSeccion`, parametro);
  }

  editarUltimaSeccionUsuario(parametro: usuarioUltimaSeccion) {
    return this.httpClient.post(`${this.zvApiUrl}/editarUsuarioUltimaSeccion`, parametro);
  }

}
