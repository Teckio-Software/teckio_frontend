import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { empresaCreacionDTO, empresaDTO, cuentaBancariaCreacionDTO, cuentaBancariaDTO, bancoDTO, CuentaBancariaObtenCodigoDTO, Empresa, empresaFiltradoDTO, EmpresaDTO } from './empresa';
import { ResponseApi } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  //HttpClient permite llamar los servicios.
  constructor(private httpClient: HttpClient) { }
  //https://localhost:7090/api/empresa
  private zvApiUrl = environment.ssoApi + "empresa";
  //Obtiene el número conforme el paginado.
  public obtenerPaginado(pagina: number, zCantidaElementosAMostrar: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<Empresa>(this.zvApiUrl + '/todos', {observe: 'response', params});
  }


  // public Lista(){
  //   return this.httpClient.get<Empresa[]>(`${this.zvApiUrl}/Lista`)
  // }

  public obtenerEmpresasPertenecientes(filtro: empresaFiltradoDTO) : Observable<any>{
    return this.httpClient.post<Empresa[]>(`${this.zvApiUrl}/empresasPertenecientes`, filtro)
  }



  //Obtiene todos los registros sin distinción
  public obtenerTodosSinPaginar(){
    return this.httpClient.get<Empresa[]>(`${this.zvApiUrl}/sinpaginar`);
  }
  public obtenerTodos(){
    return this.httpClient.get<ResponseApi>(`${this.zvApiUrl}/Lista`);
  }
  //Crea un nuevo registro.
  public crear(registro: empresaCreacionDTO){
    return this.httpClient.post(this.zvApiUrl, registro);
  }
  //Obtiene un unico registro
  public obtenerXId(id: number): Observable<empresaDTO>{
    return this.httpClient.get<empresaDTO>(`${this.zvApiUrl}/${id}`);
  }
  //Edita un registro existente.
  public editarTeckio(registro: empresaDTO){
    return this.httpClient.put(`${this.zvApiUrl}`, registro);
  }
  //Borra un registro existente.
  public borrar(zId: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${zId}`);
  }

  cambioId(idEmpresa: number){
    this.OnChange.emit(idEmpresa);
  }

  //#region CuentasBancarias
  //Cuentas Bancarias
  //-----------------

  private ApiUrl = environment.apiURL + "cuentabancaria";

  public obtenerCBPaginado(pagina: number, zCantidaElementosAMostrar: number, idEmpresa: number = 0): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<cuentaBancariaDTO>(`${this.ApiUrl}/todos/${idEmpresa}`, {observe: 'response', params});
  }

  public obtenerTodosCBSinPaginar1(idEmpresa: number){
    return this.httpClient.get<cuentaBancariaDTO[]>(`${this.ApiUrl}/sinpaginar/${idEmpresa}`);
  }
  public obtenerTodosCBSinPaginar(): Observable<cuentaBancariaDTO[]>{
    return this.httpClient.get<cuentaBancariaDTO[]>(`${this.ApiUrl}/sinpaginarcatalogo`);
  }
  //Crea un nuevo registro.
  public crearCB(registro: cuentaBancariaCreacionDTO){
    return this.httpClient.post(this.ApiUrl, registro);
  }
  //Obtiene un unico registro
  public obtenerCBXId(id: number): Observable<cuentaBancariaDTO>{
    return this.httpClient.get<cuentaBancariaDTO>(`${this.ApiUrl}/${id}`);
  }
  //Edita un registro existente.
  public editarCB(registro: cuentaBancariaDTO){
    return this.httpClient.put(`${this.ApiUrl}`, registro);
  }
  //Borra un registro existente.
  public borrarCB(zId: number){
    return this.httpClient.delete(`${this.ApiUrl}/${zId}`);
  }

  public obtenerCodigoXClabe(clabe: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('clabe', clabe.toString());
    return this.httpClient.get<CuentaBancariaObtenCodigoDTO>(`${this.ApiUrl}/codigoxclabe`, {observe: 'response', params});
  }
  //#endregion
  //Este si sirve, es para un visor corporativo
  ObtenXIdCorporativo(idCorporativo: number): Observable<EmpresaDTO[]> {
    return this.httpClient.get<EmpresaDTO[]>(`${this.zvApiUrl}/ObtenEmpresasPorCorporativo/${idCorporativo}`);
  }

  guardar(request: EmpresaDTO): Observable<ResponseApi> {
    console.log("UwU", request);
    return this.httpClient.post<ResponseApi>(`${this.zvApiUrl}/Guardar`, request);
  }

  guardarMarioEmpresa(request: Empresa): Observable<ResponseApi> {
    return this.httpClient.post<ResponseApi>(`${this.zvApiUrl}/Guardar`, request);
  }

  editarMarioEmpresa(request: Empresa): Observable<ResponseApi> {
    return this.httpClient.put<ResponseApi>(`${this.zvApiUrl}/Editar`, request);
  }

  editar(request: EmpresaDTO): Observable<ResponseApi> {
    return this.httpClient.put<ResponseApi>(`${this.zvApiUrl}/Editar`, request);
  }
}
