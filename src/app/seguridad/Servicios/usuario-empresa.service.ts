import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import {
  UsuarioEmpresaEstructura,
  UsuarioEstructuraCorporativoDTO,
} from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { Observable } from 'rxjs';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { UsuarioEmpresaCreacionDTO } from '../modelos/tsUsuarioEmpresa';

@Injectable({
  providedIn: 'root',
})
export class UsuarioEmpresaService {
  zvApiUrl = environment.ssoApi + 'usuarioempresas';
  constructor(private httpClient: HttpClient) {}
  //#region UsuariosPorCorporativo
  obtenEmpresasPorUsuario(): Observable<EmpresaDTO[]> {
    return this.httpClient.get<EmpresaDTO[]>(
      `${this.zvApiUrl}/empresasPertenecientes`
    );
  }
  ObtenUsuariosPorCliente(
    idCorporativo: number
  ): Observable<UsuarioEstructuraCorporativoDTO[]> {
    return this.httpClient.get<UsuarioEstructuraCorporativoDTO[]>(
      `${this.zvApiUrl}/usuarioXEmpresa/${idCorporativo}`
    );
  }
  ObtenEmpresasXUsuario(
    idCorporativo: number,
    idUsuario: number
  ): Observable<UsuarioEmpresaEstructura[]> {
    return this.httpClient.get<UsuarioEmpresaEstructura[]>(
      `${this.zvApiUrl}/empresasXUsuario/${idCorporativo}/${idUsuario}`
    );
  }
  creaRelacionUsuarioEmpresa(parametro: UsuarioEmpresaCreacionDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/creaRelacionUsuarioEmpresa`,
      parametro
    );
  }
  activaRelacionUsuarioEmpresa(
    idUsuario: number,
    idEmpresa: number,
    idRol: number
  ): Observable<any> {
    return this.httpClient.post(`${this.zvApiUrl}/activarEmpresaEnUsuario`, {
      idUsuario,
      idEmpresa,
      idRol,
    });
  }
}
