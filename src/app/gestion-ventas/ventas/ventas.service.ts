import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DetalleOrdenVentaDTO, ImpuestoDetalleOrdenVentaDTO, OrdenVentaDTO } from './ordenVenta';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private HttpClient: HttpClient) { }

  private apiUrl = environment.apiURL + "ordenventa";

  public crear(idEmp : number, ordenVenta: OrdenVentaDTO){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/crearOrdenVenta`, ordenVenta);
  }

  public editar(idEmp : number, ordenVenta: OrdenVentaDTO){
    return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/editarOrdenVenta`, ordenVenta);
  }

  public eliminarOrdenVenta(IdOrdenVenta : number, idEmp: number){
    return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmp}/eliminarOrdenVenta/${IdOrdenVenta}`);
  }

  public obtenerTodos(idEmp: number){
    return this.HttpClient.get<OrdenVentaDTO[]>(`${this.apiUrl}/${idEmp}/todos`);
  }

  public obtenerOrdenVenta(idOrdenVenta : number, idEmp: number){
    return this.HttpClient.get<OrdenVentaDTO>(`${this.apiUrl}/${idEmp}/obtenerOrdenVenta/${idOrdenVenta}`);
  }

  public eliminarDetalle(IdDetalle : number, idEmp: number){
    return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmp}/eliminarDetalleOrdenVenta/${IdDetalle}`);
  }

  public eliminarImpuesto(IdImpuesto : number, idEmp: number){
    return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmp}/eliminarImpuestoDetalleOrdenVenta/${IdImpuesto}`);
  }

  public crearDetalle(detalle : DetalleOrdenVentaDTO, idEmp: number){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/crearDetalleOrdenVenta`, detalle);
  }

  public editarDetalle(detalle : DetalleOrdenVentaDTO, idEmp: number){
    return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/editarDetalleOrdenVenta`, detalle);
  }

  public crearImpuesto(impuesto : ImpuestoDetalleOrdenVentaDTO, idEmp: number){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/crearImpuestoDetalleOrdenVenta`, impuesto);
  }

  public editarImpuesto(impuesto : ImpuestoDetalleOrdenVentaDTO, idEmp: number){
    return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/editarImpuestoDetalleOrdenVenta`, impuesto);
  }
}
