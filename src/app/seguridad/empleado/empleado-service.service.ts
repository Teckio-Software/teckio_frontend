import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { environment } from 'src/environments/environment.development';
import { EmpleadoDTO } from './empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoServiceService {
  private apiURL = environment.apiURL + "empleado";

  constructor(private HttpClient : HttpClient) { }

  public CrearEmpleado(IdEmp : number, objeto : EmpleadoDTO){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiURL}/${IdEmp}/CrearEmpleado`, objeto);
  }

  public EditarEmpleado(IdEmp : number, objeto : EmpleadoDTO){
    return this.HttpClient.put<RespuestaDTO>(`${this.apiURL}/${IdEmp}/EditarEmpleado`, objeto);
  }

  // public EliminarEmpleado(IdEmp : number, IdEmpleado : number){
  //   return this.HttpClient.delete<RespuestaDTO>(`${this.apiURL}/${IdEmp}/EliminarEmpleado/${IdEmpleado}`);
  // }

  public ObtenerTodos(IdEmp : number){
    return this.HttpClient.get<EmpleadoDTO[]>(`${this.apiURL}/${IdEmp}/ObtenerTodos`);
  }

  public ObtenerXId(IdEmp : number, IdEmpleado : number){
    return this.HttpClient.get<EmpleadoDTO>(`${this.apiURL}/${IdEmp}/CrearEmpleado/${IdEmpleado}`);
  }

  public ObtenerXIdUser(IdEmp : number, IdUser : number){
    return this.HttpClient.get<EmpleadoDTO>(`${this.apiURL}/${IdEmp}/ObtenerXIdUser/${IdUser}`);
  }
}
