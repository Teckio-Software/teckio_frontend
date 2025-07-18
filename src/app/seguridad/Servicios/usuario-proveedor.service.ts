import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UsuarioProveedorMultiEmpresa } from '../modelos/tsUsuarioEmpresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioProveedorService {
  zvApiUrl = environment.ssoApi + 'usuarioProveedor';
  constructor(private httpClient: HttpClient) { }

  creaRelacionUsuarioEmpresa(parametro: UsuarioProveedorMultiEmpresa) {
    return this.httpClient.post(`${this.zvApiUrl}/creaRelacionUsuarioEmpresaProveedor`, parametro);
  }
}
