import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ProductoServicioSat } from './ts.producto-servicio-sat';

@Injectable({providedIn: 'root'})
export class ProductoServicioSatService {

    constructor(private HttpClient: HttpClient) { }
    
    private apiUrl = environment.apiURL + "productoYServicioSat";

    public ObtenerTodos(idEmp: number) {
    return this.HttpClient.get<ProductoServicioSat[]>(`${this.apiUrl}/${idEmp}/obtenerTodos`);
  }

    
}