import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RespuestaDTO } from '../utilidades/tsUtilidades';
import { FacturaComplementoPagoDTO, FacturaDetalleDTO, FacturaDTO, FacturasTeckioDTO, FacturaTeckioDetallesDTO } from './facturas';

@Injectable({
  providedIn: 'root'
})
export class FacturasServiceService {

  private UrlApi : string = environment.apiURL + "factura/";

  constructor(private http:HttpClient) { }

  CargaFactura(files: FileList, idEmpresa: number): Observable<RespuestaDTO> {
    // Crea un objeto FormData y agrega los archivos a él
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('idEmpresa', idEmpresa.toString());
    // No es necesario especificar el Content-Type, FormData se encargará de ello
    return this.http.post<RespuestaDTO>(`${this.UrlApi}${idEmpresa}/CargarFactura`, formData);
  }

  ObtenFacturas(idEmpresa : number){
    return this.http.get<FacturaDTO[]>(`${this.UrlApi}${idEmpresa}/ObtenFacturas`);
  }

  ObtenFacturaDetalleXIdFactura(idEmpresa : number, IdFactura : number){
    return this.http.get<FacturaDetalleDTO[]>(`${this.UrlApi}${idEmpresa}/ObtenFacturaDetalleXIdFactura/${IdFactura}`);
  }

  ObtenComplementoPagoXIdFactura(idEmpresa : number, IdFactura : number){
    return this.http.get<FacturaComplementoPagoDTO  []>(`${this.UrlApi}${idEmpresa}/ObtenComplementoPagoXIdFactura/${IdFactura}`);
  }

  ObtenProductos(idEmpresa : number){
    return this.http.get<string[]>(`${this.UrlApi}${idEmpresa}/obtenerProductos`);
  }

  ObtenDetalleFactura(idEmpresa : number, idFactura : number){
    return this.http.get<FacturaTeckioDetallesDTO>(`${this.UrlApi}${idEmpresa}/ObtenDetalleFactura/${idFactura}`);
  }

  obtenFacturaXml(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.UrlApi}${idEmpresa}/DescargaFactura/${idFactura}`, { responseType: 'blob' });
  }

  obtenFacturaPdf(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.UrlApi}${idEmpresa}/DescargaFacturaPdf/${idFactura}`, { responseType: 'blob' });
  }

  obtenAcusePdf(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.UrlApi}${idEmpresa}/DescargaAcuse/${idFactura}`, { responseType: 'blob' });
  }
}
