import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UsuarioGastosMultiEmpresa } from '../modelos/tsUsuarioEmpresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGastosService {
  zvApiUrl = environment.ssoApi + 'usuarioGastos';
  constructor(private httpClient: HttpClient) { }

  creaRelacionUsuarioEmpresa(parametro: UsuarioGastosMultiEmpresa) {
    return this.httpClient.post(`${this.zvApiUrl}/creaRelacionUsuarioEmpresaGastos`, parametro);
  }
}
