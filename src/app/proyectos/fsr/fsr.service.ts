import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { diasConsideradosDTO, factorSalarioIntegradoDTO, factorSalarioRealDTO, factorSalarioRealDetalleDTO, relacionFSRInsumoDTO, fsrXInsumoMdODetalleDTO, fsiXInsumoMdODetalleDTO, objetoFactorSalarioXInsumoDTO } from './tsFSR';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
})
export class FSRService{
    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "fsr";

    public crearFsrDetalleXInsumo(registro: fsrXInsumoMdODetalleDTO, idEmpresa: number){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/crearFsrDetalleXInsumo`, registro);
    }

    public crearFsiDetalleXInsumo(registro: fsiXInsumoMdODetalleDTO, idEmpresa: number){
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/crearFsiDetalleXInsumo`, registro);
    }

    public obtenerFSRXInsumo(idInsumo: number, idEmpresa: number){
        return this.HttpClient.get<objetoFactorSalarioXInsumoDTO>(`${this.apiUrl}/${idEmpresa}/ObtenerFactorSalarioXInsumo/${idInsumo}`)
    }

    public editarFSRXInsumo(registro: fsrXInsumoMdODetalleDTO, idEmpresa: number){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/editarFsrDetalleXInsumo`, registro);
    }

    public editarFSIXInsumo(registro: fsiXInsumoMdODetalleDTO, idEmpresa: number){
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/editarFsiDetalleXInsumo`, registro);
    }

    public eliminarFsiDetalleXInsumo(IdFsiDetalle: number, idEmpresa: number){
        return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/eliminarFsiDetalleXInsumo/${IdFsiDetalle}`);
    }

    public eliminarFsrDetalleXInsumo(IdFsrDetalle: number, idEmpresa: number){
        return this.HttpClient.delete<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/eliminarFsrDetalleXInsumo/${IdFsrDetalle}`);
    }

    public obtenerFSR(idProyecto: number, idEmpresa: number){
        return this.HttpClient.get<factorSalarioRealDTO>(`${this.apiUrl}/${idEmpresa}/obtenerFSR/${idProyecto}`)
    }

    public obtenerFSRDetalles(idFSR: number, idEmpresa: number){
        return this.HttpClient.get<factorSalarioRealDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerFSRdetalles/${idFSR}`)
    }

    public obtenerFSI(idProyecto: number, idEmpresa: number){
        return this.HttpClient.get<factorSalarioIntegradoDTO>(`${this.apiUrl}/${idEmpresa}/obtenerFSI/${idProyecto}`)
    }

    public obtenerDiasNoLaborables(idFSI: number, idEmpresa: number){
        return this.HttpClient.get<diasConsideradosDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerdiasnolaborables/${idFSI}`)
    }

    public obtenerDiasPagados(idFSI: number, idEmpresa: number){
        return this.HttpClient.get<diasConsideradosDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerdiaspagados/${idFSI}`)
    }

    public crearDetalleFSR(detalle: factorSalarioRealDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<factorSalarioRealDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/creardetalleFSR`, detalle);
    }

    public editarDetalleFSR(detalle: factorSalarioRealDetalleDTO, idEmpresa: number){
        return this.HttpClient.post<factorSalarioRealDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/editardetalleFSR`, detalle);
    }

    public crearDiasFSI(dias: diasConsideradosDTO, idEmpresa: number){
        return this.HttpClient.post<diasConsideradosDTO[]>(`${this.apiUrl}/${idEmpresa}/creardiasFSI`, dias);
    }

    public editarDiasFSI(dias: diasConsideradosDTO, idEmpresa: number){
        return this.HttpClient.post<diasConsideradosDTO[]>(`${this.apiUrl}/${idEmpresa}/editardiasFSI`, dias);
    }

    public eliminarDetalleFSI(IdDetalleFSI: number, idEmpresa: number){
        return this.HttpClient.delete<diasConsideradosDTO[]>(`${this.apiUrl}/${idEmpresa}/eliminarDetalleFSI/${IdDetalleFSI}`);
    }

    public eliminarDetalleFSR(IdDetalleFSR: number, idEmpresa: number){
        return this.HttpClient.delete<factorSalarioRealDetalleDTO[]>(`${this.apiUrl}/${idEmpresa}/eliminarDetalleFSR/${IdDetalleFSR}`);
    }
}