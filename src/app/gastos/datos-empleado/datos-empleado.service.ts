import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ContratosDTO, DatosEmpleadoCreacionDTO, DatosEmpleadoDTO, JornadasDTO, PlazaCentroDTO, PlazaCuentaDTO, PlazaEmpleadoDTO, RegimenesDTO, RiesgosDTO, UsuarioGastosDTO, arbolDTO, arbol_AutorizadoresDTO, autorizadoresDTO } from './tsDatos-empleado';
import { Observable } from 'rxjs';
import { plazaEmpleadoDTO } from '../conf-plaz-div/tsConf-plaza-div';

@Injectable({
  providedIn: 'root'
})
export class DatosEmpleadoService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "EmpleadoGastos";
  private zvApiUrlArbol = environment.apiURL + "ArbolAutorizacion";

  private usuarios: autorizadoresDTO[] = []; // Ejemplo de usuarios disponibles
  private niveles: autorizadoresDTO[][] = []; // Matriz para almacenar usuarios asignados a cada nivel


  public obtenerPaginadoUsuarioGastos(idEmpresa: number): Observable<any>{
    return this.httpClient.get<UsuarioGastosDTO[]>(`${this.zvApiUrl}/0/ObtenerUsuarioGastos`);
  }
  public obtenerUsuarioGastosxid(idUsuario: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<UsuarioGastosDTO>(`${this.zvApiUrl}/0/ObtenerUsuarioGastosxIdUsuario/${idUsuario}`);
  }
  public obtenerEmpleadosGastos(idEmpresa: number): Observable<any>{
    return this.httpClient.get<DatosEmpleadoDTO[]>(`${this.zvApiUrl}/0/ObtenerEmpleadoOperativo`);
  }
  public obtenerEmpleadosGastosxid(idUsuario: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<DatosEmpleadoDTO>(`${this.zvApiUrl}/0/ObtenerEmpleadoOperativoxidUsuario/${idUsuario}`);
  }
  public obtenerPaginadoPlazaEmpleado(idPlaza: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<plazaEmpleadoDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazaEmpleados/${idPlaza}`);
  }
  public obtenerPaginadoPlazaCuenta(idPlaza: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<PlazaCuentaDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazaCuenta/${idPlaza}`);
  }
  public obtenerPaginadoPlazaCentro(idPlaza: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<PlazaCentroDTO[]>(`${this.zvApiUrl}/0/ObtenerPlazaCentro/${idPlaza}`);
  }  
  public crearPlazaEmpleado(registro: PlazaEmpleadoDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearRelacionPlazaEmpleado`, registro);
  }
  public crearPlazaCuenta(registro: PlazaCuentaDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearRelacionPlazaCuenta`, registro);
  }
  public crearPlazaCentro(registro: PlazaCentroDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearRelacionPlazaCentro`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<DatosEmpleadoDTO>{
    return this.httpClient.get<DatosEmpleadoDTO>(`${this.zvApiUrl}/0/Obtenerxid/${id}`);
  }

  

  public obtenerContrato(idEmpresa: number): Observable<any>{
    return this.httpClient.get<ContratosDTO[]>(`${this.zvApiUrl}/0/ObtenerClaveContrato`);
  }
  public obtenerRiesgo(idEmpresa: number): Observable<any>{
    return this.httpClient.get<RiesgosDTO[]>(`${this.zvApiUrl}/0/ObtenerClaveRiesgo`);
  }
  public obtenerRegimen(idEmpresa: number): Observable<any>{
    return this.httpClient.get<RegimenesDTO[]>(`${this.zvApiUrl}/0/ObtenerClaveRegimen`);
  }
  public obtenerJornada(idEmpresa: number): Observable<any>{
    return this.httpClient.get<JornadasDTO[]>(`${this.zvApiUrl}/0/ObtenerClaveJornada`);
  }

  public crearEmpleado(registro: DatosEmpleadoDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/0/CrearEmpleado`, registro);
  }

  public editarEmpleado(registro: DatosEmpleadoDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/0/EditarEmpleado`, registro);
  }

//Sección de árbol

  public crearArbol(registro: arbolDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrlArbol}/0/CrearArbol`, registro)
  }
  
  public obtenerArbolxPlaza(idPlaza: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<arbolDTO>(`${this.zvApiUrlArbol}/0/ObtenerArbol/${idPlaza}`);
  }

  public obtenerPaginadoAutorizadores(idEmpresa: number): Observable<any>{
    return this.httpClient.get<autorizadoresDTO[]>(`${this.zvApiUrlArbol}/0/ObtenerAutorizadores`);
  }

  public obtenerArbol_Autorizadores(idArbol: number, idEmpresa: number): Observable<any>{
    return this.httpClient.get<arbol_AutorizadoresDTO[]>(`${this.zvApiUrlArbol}/0/ObtenerArbol_autorizadores/${idArbol}`);
  }

  public CrearRelación_ArbolxAutorizador(registro: arbol_AutorizadoresDTO[], idEmpresa: number){
    return this.httpClient.post<arbol_AutorizadoresDTO[]>(`${this.zvApiUrlArbol}/0/CrearRelación_ArbolxAutorizador`, registro)
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
