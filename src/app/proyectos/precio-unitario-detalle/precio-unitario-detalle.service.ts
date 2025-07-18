import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { precioUnitarioDetalleDTO } from './tsPrecioUnitarioDetalle';
import { Observable } from 'rxjs';
import { operacionesXPrecioUnitarioDetalleDTO } from './tsOperacionesXPrecioUnitarioDetalle';

@Injectable({
  providedIn: 'root'
})
export class PrecioUnitarioDetalleService {

    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "preciounitariodetalle";
  
    public obtenerTodos(idPrecioUnitario: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/todos/${idPrecioUnitario}`);
    }

    public obtenerTodosFiltrado(idPrecioUnitario: number, idTipoInsumo: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/todosFiltrado/${idPrecioUnitario}/${idTipoInsumo}`);
    }

    public obtenerHijos(padre: precioUnitarioDetalleDTO, idEmpresa: number): Observable<any>{
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenhijos`, padre);
    }

    public creaRegistro(nuevoRegistro: precioUnitarioDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/crear`, nuevoRegistro);
    }

    public editaRegistro(registro: precioUnitarioDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/editar`, registro);
    }

    public editarImporte(registro: precioUnitarioDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/editarImporte`, registro);
    }

    public eliminaRegistro(id: number, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/eliminar`, id);
    }

    public partirDetalle(registro: precioUnitarioDetalleDTO, idEmpresa: number): Observable<precioUnitarioDetalleDTO[]>{
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/partirDetalle`, registro);
    }

    public obtenerOperaciones(idPrecioUnitarioDetalle: number, idEmpresa: number){
        return this.HttpClient.get<operacionesXPrecioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerOperaciones/${idPrecioUnitarioDetalle}`);
    }

    public crearOperacion(operacion: operacionesXPrecioUnitarioDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/crearOperaciones`, operacion);
    }

    public editarOperacion(operacion: operacionesXPrecioUnitarioDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/editarOperaciones`, operacion);
    }

    public eliminarOperacion(idOperacion: number, idEmpresa: number){
        return this.HttpClient.post<precioUnitarioDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/eliminarOperacion`, idOperacion);
    }
}