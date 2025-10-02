import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  constructor(private HttpClient: HttpClient) {}

  private apiUrl = environment.apiURL + 'imagen';

  public obtenerImagen(idEmpresa: number, id: number) {
    return this.HttpClient.get<any>(`${this.apiUrl}/${idEmpresa}/obtenerXId/${id}`);
  }

  cargarImagen(idEmpresa: number, formData: FormData) {
    return this.HttpClient.post<any>(`${this.apiUrl}/${idEmpresa}/CargarImagen`, formData);
  }

}
