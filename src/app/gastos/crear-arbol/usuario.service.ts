import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { arbol_AutorizadoresDTO, autorizadoresDTO } from '../datos-empleado/tsDatos-empleado';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGastosService {
  private usuarios: autorizadoresDTO[] = []; // Ejemplo de usuarios disponibles
  private niveles: autorizadoresDTO[][] = []; // Matriz para almacenar usuarios asignados a cada nivel

  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "ArbolAutorizacion";

  public obtenerPaginadoAutorizadores(): Observable<any>{
    return this.httpClient.get<autorizadoresDTO[]>(`${this.zvApiUrl}/0/ObtenerAutorizadores`);
  }

  public obtenerArbol_Autorizadores(idArbol: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<arbol_AutorizadoresDTO[]>(`${this.zvApiUrl}/0/ObtenerArbol_autorizadores/${idArbol}`);
  }

  public CrearRelación_ArbolxAutorizador(registro: arbol_AutorizadoresDTO[], idEmpresa: number){
    return this.httpClient.post<arbol_AutorizadoresDTO[]>(`${this.zvApiUrl}/0/CrearRelación_ArbolxAutorizador`, registro)
  }

  eliminarUsuario(usuario: autorizadoresDTO): void {
    const index = this.usuarios.indexOf(usuario);
    if (index !== -1) {
      this.usuarios.splice(index, 1);
    }
  }

  getNiveles(): autorizadoresDTO[][] {
    return this.niveles;
  }

  agregarUsuarioANivel(usuario: autorizadoresDTO, nivelIndex: number): void {
    if (!this.niveles[nivelIndex]) {
      this.niveles[nivelIndex] = [];
    }
    this.niveles[nivelIndex].push(usuario);
  }
}
