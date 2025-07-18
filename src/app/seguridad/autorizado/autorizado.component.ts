import { Component, Input } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Observable, of } from 'rxjs';
import { permisos } from './tsAutorizado';

@Component({
  selector: 'app-autorizado',
  templateUrl: './autorizado.component.html',
  styleUrls: ['./autorizado.component.css']
})
export class AutorizadoComponent {
  constructor(private zvSeguridadService: SeguridadService) { }
  @Input()
  zvRol!: string;
  @Input()
  permisosAdministracionUsuarios: permisos[] = []
  @Input()
  zvPermiso!: string;
  @Input()
  zvPermisoPantalla!: string;
  zfEstaAutorizado(): boolean{
    if (this.zvRol) {
      return this.zvSeguridadService.zfObtenerRol() === this.zvRol;
    } else{
      return this.zvSeguridadService.zfEstaLogueadoBoolean();
    }
  }
  zfEstaAutorizadoPermiso():Boolean{
    if (this.zvPermiso) {
      return this.zvSeguridadService.zfObtenerPermisoEspecialPantalla(this.zvPermisoPantalla) === this.zvPermiso;
    }
    else{
      return this.zvSeguridadService.zfEstaLogueadoBoolean();
    }
  }
  estaAutorizadoPermisos():Boolean{
    let autorizaciones: boolean[] = [];
    this.permisosAdministracionUsuarios.forEach(element => {
      let esAutorizado = this.zvSeguridadService.zfObtenerPermisoEspecialPantalla(element.permiso) === element.valor;
      autorizaciones.push(esAutorizado);
    });
    let autorizado = autorizaciones.filter(z => z == true);
    if (autorizado.length > 0) {
      return true;
    }
    return false;
  }
}
