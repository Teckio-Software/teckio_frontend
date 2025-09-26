import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DatosParaCopiarArmadoDTO, DatosParaImportarCatalogoGeneralDTO, datosParaCopiarDTO, precioUnitarioDTO, preciosParaEditarPosicionDTO } from './tsPrecioUnitario';
import { Observable } from 'rxjs';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { InsumoParaExplosionDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
})
export class PrecioUnitarioService {
    constructor(private HttpClient: HttpClient) { }
    private apiUrl = environment.apiURL + "preciounitario";

    public obtenerEstructurado(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.get<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/todos/${idProyecto}`)
    }

    public obtenerSinEstructurar(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.get<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/sinestructurar/${idProyecto}`)
    }

    public obtenerConceptos(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.get<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerConceptos/${idProyecto}`)
    }

    public autorizarPresupuesto(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.get(`${this.apiUrl}/${idEmpresa}/AutorizarPresupuesto/${idProyecto}`)
    }

    public removerAutorizacionPresupuesto(idProyecto: number, idEmpresa: number): Observable<RespuestaDTO> {
        return this.HttpClient.get<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/RemoverAutorizacionPresupuesto/${idProyecto}`)
    }

    public autorizarXPrecioUnitario(precioUniatrio: precioUnitarioDTO, idEmpresa: number): Observable<any> {
        return this.HttpClient.post(`${this.apiUrl}/${idEmpresa}/AutorizarXPrecioUnitario`, precioUniatrio)
    }

    public crearYObtener(precioUnitario: precioUnitarioDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/crear`, precioUnitario)
    }

    public editar(precioUnitario: precioUnitarioDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/editar`, precioUnitario)
    }

    public partirConcepto(registro: precioUnitarioDTO, idEmpresa: number): Observable<precioUnitarioDTO[]>{
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/partirConcepto`, registro);
    }

    public editarIndirectoPrecioUnitario(precioUnitario: precioUnitarioDTO, idEmpresa: number) {
        return this.HttpClient.post<boolean>(`${this.apiUrl}/${idEmpresa}/EditarIndirectoPrecioUnitario`, precioUnitario)
    }

    public eliminar(idPrecioUnitario: number, idEmpresa: number) {
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/eliminar`, idPrecioUnitario)
    }

    public obtenerEstructuradosParaCopiar(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.get<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/todoscopia/${idProyecto}`)
    }

    public copiarRegistros(datos: datosParaCopiarDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/copiaregistros`, datos);
    }

    public importarCatalogoAPrecioUnitario(datos: DatosParaImportarCatalogoGeneralDTO, idEmpresa: number) {
        return this.HttpClient.post(`${this.apiUrl}/${idEmpresa}/importarCatalogoAPrecioUnitario`, datos);
    }

    public eliminarCatalogoGeneral(lista: precioUnitarioDTO[], idEmpresa: number) {
        return this.HttpClient.post(`${this.apiUrl}/${idEmpresa}/eliminarCatalogoGeneral`, lista);
    }

    public agregarCatalogoGeneral(lista: precioUnitarioDTO[], idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/agregarCatalogoGeneral`, lista);
    }

    public remplazarCatalogoGeneral(lista: precioUnitarioDTO[], idEmpresa: number) {
        return this.HttpClient.post(`${this.apiUrl}/${idEmpresa}/remplazarCatalogoGeneral`, lista);
    }

    public copiarArmado(datos: DatosParaCopiarArmadoDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/copiararmado`, datos)
    }

    public copiarArmadoComoConcepto(datos: DatosParaCopiarArmadoDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/copiararmadocomoconcepto`, datos)
    }

    public explosionDeInsumos(idProyecto: number, idEmpresa: number) {
        return this.HttpClient.get<InsumoParaExplosionDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerExplosionDeInsumos/${idProyecto}`)
    }

    public obtenerExplosionDeInsumosXPrecioUnitario(precioUnitario: precioUnitarioDTO, idEmpresa: number) {
      console.log("aqui esta el objeto real", precioUnitario);

        return this.HttpClient.post<InsumoParaExplosionDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerExplosionDeInsumosXPrecioUnitario`, precioUnitario)
    }

    public editarDesdeExplosion(insumo: InsumoParaExplosionDTO, idEmpresa: number) {
        return this.HttpClient.post<InsumoParaExplosionDTO[]>(`${this.apiUrl}/${idEmpresa}/editarCostoDesdeExplosion`, insumo)
    }

    public obtenerExplosionDeInsumosXEmpleado(idProyecto: number, idEmpresa: number, idEmpleado: number) {
        return this.HttpClient.get<InsumoParaExplosionDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerExplosionDeInsumosXEmpleado/${idProyecto}/${idEmpleado}`)
    }

    public recalcularPresupuesto(idProyecto: number, idEmpresa: number): Observable<any> {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/recalcularPresupuesto`, idProyecto)
    }

    public moverPosicion(registros: preciosParaEditarPosicionDTO, idEmpresa: number) {
        return this.HttpClient.post<precioUnitarioDTO[]>(`${this.apiUrl}/${idEmpresa}/moverRegistro`, registros)
    }

    importarPresupuestoExcel(files: FileList, idEmpresa: number, idProyecto : number): Observable<RespuestaDTO> {
        // Crea un objeto FormData y agrega los archivos a él
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('idEmpresa', idEmpresa.toString());
        formData.append('idProyecto', idProyecto.toString());
        console.log("Data", formData);
        // No es necesario especificar el Content-Type, FormData se encargará de ello
        // return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/ImportarOpus`, formData)
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/importarPresupuestoExcel`, formData)
    }

    importarPresupuestoOpus(files: FileList, idEmpresa: number, idProyecto: number): Observable<RespuestaDTO> {
      // Crea un objeto FormData y agrega los archivos a él
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('idEmpresa', idEmpresa.toString());
        formData.append('idProyecto', idProyecto.toString());
        console.log("Data", formData);
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/ImportarOpus`, formData)
    }
}
