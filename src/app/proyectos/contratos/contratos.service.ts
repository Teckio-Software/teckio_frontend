import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { contratoDTO, destajistasXConceptoDTO, detalleXContratoParaTablaDTO, parametrosParaBuscarContratos } from './tsContratos';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
  })
  export class ContratoService {
    
    constructor(private httpClient: HttpClient) { }
    private apiUrl = environment.apiURL + "contratos";

    public obtenerDestajos(parametros: parametrosParaBuscarContratos, idEmpresa: number){
        return this.httpClient.post<contratoDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerContratosDestajos`, parametros);
    }

    public crearContratoDestajo(registro: contratoDTO, idEmpresa:number){
        return this.httpClient.post(`${this.apiUrl}/${idEmpresa}/crearContratoDestajo`, registro)
    }

    public editarContratoDestajo(registro: contratoDTO, idEmpresa:number){
        return this.httpClient.post(`${this.apiUrl}/${idEmpresa}/editarContratoDestajo`, registro)
    }

    public obtenerDetallesDestajos(idContrato: number, idEmpresa: number){
        return this.httpClient.get<detalleXContratoParaTablaDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerDetallesDestajos/${idContrato}`)
    }

    public crearOEditarDetalle(registro: detalleXContratoParaTablaDTO, idEmpresa: number){
        return this.httpClient.post(`${this.apiUrl}/${idEmpresa}/crearOEditarDetalle`, registro)
    }

    public FiniquitarXContrato(parametros: parametrosParaBuscarContratos, idEmpresa: number){
        return this.httpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/finiquitarXContrato`, parametros);
    }

    public ObtenerDestajistasXConcepto(parametros: detalleXContratoParaTablaDTO, idEmpresa: number){
        return this.httpClient.post<destajistasXConceptoDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerDestajistasXConcepto`, parametros);
    }
  }