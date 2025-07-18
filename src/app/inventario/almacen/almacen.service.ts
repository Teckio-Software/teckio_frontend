import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { almacenDTO, almacenCreacionDTO } from './almacen';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
})
export class AlmacenService{

    @Output()
    OnChange: EventEmitter<number> = new EventEmitter<number>();
    constructor(private HttpClient: HttpClient){}
    private zvApiUrl = environment.apiURL;

    public obtenerPaginado(pagina: number, zCantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
        return this.HttpClient.get<almacenDTO[]>(`${this.zvApiUrl}${idEmpresa}/almacen/todos`, {observe: 'response', params})
    }

    public obtenerTodosSinPaginar(idEmpresa: number){
        return this.HttpClient.get<almacenDTO[]>(`${this.zvApiUrl}almacen/${idEmpresa}/ObtenTodos`);
    }

    public crear(registro: almacenCreacionDTO, idEmpresa: number){
        return this.HttpClient.post<RespuestaDTO>(`${this.zvApiUrl}almacen/${idEmpresa}/Crear`, registro);
    }

    public obtenerXId(idProyecto: number, idEmpresa: number){
        return this.HttpClient.get<almacenDTO>(`${this.zvApiUrl}${idEmpresa}/almacen/${idProyecto}`);
    }

    public obtenerXIdProyecto(id: number, idEmpresa: number){
        return this.HttpClient.get<almacenDTO[]>(`${this.zvApiUrl}almacen/${idEmpresa}/ObtenXIdProyecto/${id}`);
    }

    public editar(registro: almacenDTO, idEmpresa: number){
        return this.HttpClient.put<RespuestaDTO>(`${this.zvApiUrl}almacen/${idEmpresa}/Editar`, registro);
    }

    public borrar(zId: number, idEmpresa: number){
        return this.HttpClient.delete(`${this.zvApiUrl}${idEmpresa}/almacen/${zId}`);
    }

    cambioId(idAlmacen: number, idEmpresa: number){
        this.OnChange.emit(idAlmacen)
    }
}
