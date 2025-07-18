import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ordenCompraDTO, ordenCompraCreacionDTO, OrdenCompraFacturasDTO, FacturaXOrdenCompraDTO, OrdenesCompraXInsumoDTO } from './tsOrdenCompra';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';

@Injectable({
    providedIn: 'root'
})
export class OrdenCompraService {
    constructor(private HttpClient: HttpClient) { }
    private apiUrl = environment.apiURL + "ordencompra";

    cargarFacturasXOrdenCompra(files: FileList, idEmpresa: number, IdOrdenCompra: number): Observable<RespuestaDTO> {
        // Crea un objeto FormData y agrega los archivos a él
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('IdOrdenCompra', IdOrdenCompra.toString());
        // No es necesario especificar el Content-Type, FormData se encargará de ello
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmpresa}/cargarFacturasXOrdenCompra`, formData);
    }

    public ObtenerFacturasXOrdenCompra(idEmp: number, IdOrdenCompra: number) {
        return this.HttpClient.get<OrdenCompraFacturasDTO>(`${this.apiUrl}/${idEmp}/obtenerFacturasXOrdenCompra/${IdOrdenCompra}`)
    }

    public obtenerPaginado(pagina: number, cantidadElementosAMostrar: number, idProyecto: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadElementosAMostrar.toString());
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/todos/${idProyecto}`, { observe: 'response', params });
    }

    public obtenerTodosSinPaginar(idProyecto: number) {
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/todos/${idProyecto}`);
    }

    public ObtenTotdas(idEmp: number) {
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerTodas`)
    }

    public ObtenXIdRequisicion(idEmp: number, idRequisicion: number) {
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdRequisicion/${idRequisicion}`)
    }

    public ObtenXIdCotizacion(idEmp: number, idCotizacion: number) {
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenXIdCotizacion/${idCotizacion}`)
    }

    public ObtenerXIdContratistaSinPagar(idEmp: number, idContratista: number) {
        return this.HttpClient.get<ordenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerXIdContratistaSinPagar/${idContratista}`)
    }

    public ObtenerFacturasXIdContratistaSinPagar(idEmp: number, idContratista: number) {
        return this.HttpClient.get<FacturaXOrdenCompraDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerFacturasXIdContratistaSinPagar/${idContratista}`)
    }

    public AutorizarFacturaXOrdenCompra(idEmp: number, facturaXOC: FacturaXOrdenCompraDTO) {
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/AutorizarFacturaXOrdenCompra`, facturaXOC)
    }

    public CancelarFacturaXOrdenCompra(idEmp: number, facturaXOC: FacturaXOrdenCompraDTO) {
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CancelarFacturaXOrdenCompra`, facturaXOC)
    }

    public obtenerXId(id: number): Observable<ordenCompraDTO> {
        return this.HttpClient.get<ordenCompraDTO>(`${this.apiUrl}/${id}`)
    }

    public CrearOrdenCompra(idEmp: number, registro: ordenCompraCreacionDTO) {
        return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/CrearOrdenCompra`, registro);
    }

    public EditarOrdenCompra(idEmp: number, registro: ordenCompraDTO) {
        return this.HttpClient.put<RespuestaDTO>(`${this.apiUrl}/${idEmp}/EditarOrdenCompra`, registro);
    }

    public crearTodos(registro: ordenCompraCreacionDTO) {
        return this.HttpClient.post(`${this.apiUrl}/comprarcotizacion`, registro);
    }

    public crearUno(idInsumoXCotizacion: number) {
        return this.HttpClient.post(`${this.apiUrl}/compraruno`, idInsumoXCotizacion);
    }

    public editar(registro: ordenCompraDTO) {
        return this.HttpClient.put(`${this.apiUrl}`, registro);
    }

    public ObtenerInsumosComprados(idEmp: number, IdProyecto: number) {
        return this.HttpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerInsumosComprados/${IdProyecto}`)
    }

    public ObtenerOrdenesCompraXInsumo(idEmp: number, IdInsumo: number) {
        return this.HttpClient.get<OrdenesCompraXInsumoDTO[]>(`${this.apiUrl}/${idEmp}/ObtenerOrdenesCompraXInsumo/${IdInsumo}`)
    }

}
