import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectoStateService {
  private proyectoNombreSubject: BehaviorSubject<string | null>;
  proyectoNombre$;

  constructor() {
    const nombreGuardado = localStorage.getItem('proyectoNombre');
    this.proyectoNombreSubject = new BehaviorSubject<string | null>(
      nombreGuardado ? nombreGuardado : null
    );
    this.proyectoNombre$ = this.proyectoNombreSubject.asObservable();
  }

  setProyectoNombre(proyecto: { nombre: string } | string) {
    const nombre = typeof proyecto === 'string' ? proyecto : proyecto.nombre;
    this.proyectoNombreSubject.next(nombre);
    localStorage.setItem('proyectoNombre', nombre);
  }

  getProyectoNombre() {
    return this.proyectoNombreSubject.getValue();
  }

  limpiarProyectoNombre() {
    this.proyectoNombreSubject.next(null);
    localStorage.removeItem('proyectoNombre');
  }
}
