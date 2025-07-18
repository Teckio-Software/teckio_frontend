import { Component, Input } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SeguridadService } from '../seguridad/seguridad.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(public zvSeguridadService: SeguridadService) { }

  catalogosMenu = false;
  catalogosContabilidad = false;
  menuInventario2 = false;
  menuCompras2 = false;
  menuProveedores = false;
  menuPresupuesto = false;

  mostrarCatalogoMenu() {
    this.catalogosMenu = !this.catalogosMenu;
    this.catalogosContabilidad = false;
    this.menuInventario2 = false;
    this.menuCompras2 = false;
    this.menuPresupuesto = false;
    this.menuProveedores = false;
  }

  mostrarCatalogoContabilidad() {
    this.catalogosContabilidad = !this.catalogosContabilidad;
    this.catalogosMenu = false;
    this.menuInventario2 = false;
    this.menuCompras2 = false;
    this.menuPresupuesto = false;
    this.menuProveedores = false;
  }

  mostrarMenuInventario() {
    this.menuInventario2 = !this.menuInventario2;
    this.catalogosContabilidad = false;
    this.catalogosMenu = false;
    this.menuCompras2 = false;
    this.menuPresupuesto = false;
    this.menuProveedores = false;
  }

  cerrarMenus() {
    this.catalogosMenu = false;
    this.catalogosContabilidad = false;
    this.menuInventario2 = false;
    this.menuCompras2 = false;
    this.menuPresupuesto = false;
    this.menuProveedores = false;
  }

  cerrarCompras() {
    this.menuCompras2 = !this.menuCompras2;
    this.catalogosMenu = false;
    this.catalogosContabilidad = false;
    this.menuInventario2 = false;
    this.menuPresupuesto = false;
    this.menuProveedores = false;
  }

  cerrarProveedores() {
    this.menuProveedores = !this.menuProveedores;
    this.menuCompras2 = false;
    this.catalogosMenu = false;
    this.catalogosContabilidad = false;
    this.menuInventario2 = false;
    this.menuPresupuesto = false;
  }

  cerrarPresupuesto() {
    this.menuPresupuesto = !this.menuPresupuesto;
    this.catalogosMenu = false;
    this.catalogosContabilidad = false;
    this.menuInventario2 = false;
    this.menuCompras2 = false;
    this.menuProveedores = false;
  }


  @Input()
  zvCampoPermiso!: string;
  

  requisicionAcceso(){
    this.zvSeguridadService.zfObtenerCampoJwt(this.zvCampoPermiso);
  }
}
