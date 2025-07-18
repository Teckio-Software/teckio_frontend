
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import {
  usuarioProyectoDTO,
  usuarioProyectoParametrosBusquedaDTO,
} from './tsUsuarioProyecto';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ProyectoUsuarioService {
  constructor(private httpClient: HttpClient) {}
  zvApiUrlProyectosUsuario = environment.ssoApi + 'UsuarioProyecto';
  obtenerProyectosPorEmpresaPorUsuario(
    parametros: usuarioProyectoParametrosBusquedaDTO
  ) {
    return this.httpClient.post<usuarioProyectoDTO[]>(
      `${this.zvApiUrlProyectosUsuario}/obtenerProyectosUsuario`,
      parametros
    );
  }

  asignarProyectoAUsuario(registro: usuarioProyectoDTO) {
    return this.httpClient.post<usuarioProyectoDTO[]>(
      `${this.zvApiUrlProyectosUsuario}/asignarProyectoUsuario`,
      registro
    );
  }

  asignarRolDefault(registro: usuarioProyectoDTO) {
    return this.httpClient.post<usuarioProyectoDTO[]>(
      `${this.zvApiUrlProyectosUsuario}/asignarRolDefault`,
      registro
    );
  }
}
