import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { PrecioUnitarioXEmpleadoDTO } from './empleado';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoPreciounitarioService {

  private apiURL = environment.apiURL + "precioUnitarioXEmpleado";

  constructor(public http : HttpClient){}

  public Crear(IdEmp : number, objeto : PrecioUnitarioXEmpleadoDTO){
    return this.http.post<RespuestaDTO>(`${this.apiURL}/${IdEmp}/Crear`, objeto);
  }

  public CrearLista(IdEmp : number, objeto : PrecioUnitarioXEmpleadoDTO[]){
    return this.http.post<RespuestaDTO>(`${this.apiURL}/${IdEmp}/CrearLista`, objeto);
  }

  public ObtenerXIdEmpleado(IdEmp : number, IdEmpleado : number){
    return this.http.get<PrecioUnitarioXEmpleadoDTO[]>(`${this.apiURL}/${IdEmp}/ObtenerXIdEmpleado/${IdEmpleado}`);
  }

  public ObtenerParaAsignarPreciosUniatrios(IdEmp : number, IdEmpleado : number, IdProyecto : number){
    return this.http.get<PrecioUnitarioXEmpleadoDTO[]>(`${this.apiURL}/${IdEmp}/ObtenerParaAsignarPreciosUniatrios/${IdEmpleado}/${IdProyecto}`);
  }
}
