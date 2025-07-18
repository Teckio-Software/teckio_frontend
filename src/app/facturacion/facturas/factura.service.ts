import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi, RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { environment } from 'src/environments/environment.development';
import { BuscarFacturasDTO, FacturaEstructuraDTO, Facturas } from './tsFacturas';
import { OrdenCompraWS } from '../orden-compra-ws-utilidades/tsOrdenCompra';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlApi:string = environment.apiURL + "MisFacturas/";

  constructor(private http:HttpClient) { }

  obtenFacturas(idEmpresa: number, request: BuscarFacturasDTO): Observable<Facturas[]> {
    return this.http.post<Facturas[]>(`${this.urlApi}${idEmpresa}/ConsultarFacturas`, request);
  }

  obtenFacturaDetalle(idEmpresa: number, idFactura: number): Observable<FacturaEstructuraDTO> {
    return this.http.get<FacturaEstructuraDTO>(`${this.urlApi}${idEmpresa}/ObtenerDetalleFactura/${idFactura}`);
  }

  obtenFacturaXml(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.urlApi}${idEmpresa}/DescargaFactura/${idFactura}`, { responseType: 'blob' });
  }

  obtenFacturaPdf(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.urlApi}${idEmpresa}/DescargaFacturaPdf/${idFactura}`, { responseType: 'blob' });
  }

  CargaFactura(files: FileList, idEmpresa: string, ordenCompra: OrdenCompraWS, entradaMaterial: string): Observable<RespuestaDTO> {
    // Crea un objeto FormData y agrega los archivos a él
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    let ordenCompraJson = JSON.stringify(ordenCompra);
    formData.append('ordenCompra', ordenCompraJson);
    formData.append('selectedEntradaMaterial', entradaMaterial);
    const httpOptions = {
      headers: new HttpHeaders()
    };
    // No es necesario especificar el Content-Type, FormData se encargará de ello
    return this.http.post<RespuestaDTO>(`${this.urlApi}${idEmpresa}/CargaFactura`, formData, httpOptions);
  }

  ValidaRFCEmisorExiste(files: FileList,usuario:string): Observable<ResponseApi> {
    // Crea un objeto FormData y agrega los archivos a él
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Agrega el parámetro de usuario al FormData
    formData.append('usuario', usuario);
    const httpOptions = {
      headers: new HttpHeaders()
    };
    // No es necesario especificar el Content-Type, FormData se encargará de ello
    return this.http.post<ResponseApi>(`${this.urlApi}ValidaRFCEmisorExiste`, formData, httpOptions);
  }

  ValidaUUIDExiste(files:FileList,organizacion:number,usuario:string):Observable<ResponseApi>{
    // Crea un objeto FormData y agrega los archivos a él
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Agrega el parámetro de organizacion al FormData
    formData.append('idOrganizacion', organizacion.toString());
    // Agrega el parámetro de usuario al FormData
    formData.append('usuario', usuario);
    const httpOptions = {
      headers: new HttpHeaders()
    };
    // No es necesario especificar el Content-Type, FormData se encargará de ello
    return this.http.post<ResponseApi>(`${this.urlApi}ValidaUUIDExiste`, formData, httpOptions);
  }
}
