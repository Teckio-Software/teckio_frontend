import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Imagen } from './ts.parametros-imprimir-pu';

@Injectable({providedIn: 'root'})
export class ImagenService {
    private apiUrl = environment.apiURL + "imagen";
    constructor(private HttpClient: HttpClient) { }

    public ObtenerXId(idEmpresa: number, id: number):Observable<Imagen>{
        return this.HttpClient.get<Imagen>(`${this.apiUrl}/${idEmpresa}/obtenerXId${id}`)
    }
    
}