import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { usuarioBaseDTO } from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { Corporativo } from 'src/app/catalogos/empresas/empresa';
import { UsuarioCorporativoCreacionDTO } from '../modelos/tsUsuarioEmpresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioCorporativoService {
  zvApiUrl = environment.ssoApi + 'usuarioCorporativo';
  constructor(private httpClient: HttpClient) { }
  //#region UsuariosPorCorporativo
  obtenUsuariosPorCorporativo(idCorporativo:number): Observable<usuarioBaseDTO[]> {
    return this.httpClient.get<usuarioBaseDTO[]>(`${this.zvApiUrl}/usuariosXCorporativo/${idCorporativo}`);
  }
  //#endregion
  obtenCorporativosPorUsuario(idCorporativo: number): Observable<Corporativo[]> {
    return this.httpClient.get<Corporativo[]>(`${this.zvApiUrl}/usuariosXCorporativo`);
  }
  obtenCorporativosPertenecientes(): Observable<Corporativo[]> {
    return this.httpClient.get<Corporativo[]>(`${this.zvApiUrl}/corporativosPertenecientes`);
  }
  creaUsuarioCorporativo(usuarioCorporativo: UsuarioCorporativoCreacionDTO) {
    return this.httpClient.post(`${this.zvApiUrl}/CreaUsuarioCorporativo`, usuarioCorporativo);
  }
}
